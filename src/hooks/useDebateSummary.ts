import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { getGeminiModel, isGeminiConfigured } from "../lib/gemini";
import { DEBATE_SUMMARY_PROMPT, formatDebateForPrompt } from "../lib/prompts";
import { useDebateStore } from "../stores/debateStore";
import type { DebateSummary, ClashStatus, Side } from "../types";
import { CLASH_STATUS, SIDES } from "../types";

/**
 * Zod schema for validating the AI response.
 */
const debateSummarySchema = z.object({
  majorArguments: z.array(
    z.object({
      side: z.enum([SIDES.AFFIRMATIVE, SIDES.NEGATIVE]),
      argument: z.string(),
      strength: z.number().min(0).max(100),
    }),
  ),
  areasOfClash: z.array(
    z.object({
      topic: z.string(),
      affirmativePosition: z.string(),
      negativePosition: z.string(),
      status: z.enum([
        CLASH_STATUS.RESOLVED,
        CLASH_STATUS.CONTESTED,
        CLASH_STATUS.UNADDRESSED,
      ]),
    }),
  ),
  recommendations: z.array(z.string()),
  overallAssessment: z.string(),
});

/**
 * Parses and validates the AI response into a DebateSummary.
 */
const parseAIResponse = (content: string): DebateSummary => {
  // Try to extract JSON from the response
  let jsonContent = content;

  // Handle case where response is wrapped in markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonContent = jsonMatch[1];
  }

  // Parse and validate
  const parsed = JSON.parse(jsonContent);
  const validated = debateSummarySchema.parse(parsed);

  return {
    majorArguments: validated.majorArguments.map((arg) => ({
      side: arg.side as Side,
      argument: arg.argument,
      strength: arg.strength,
    })),
    areasOfClash: validated.areasOfClash.map((clash) => ({
      topic: clash.topic,
      affirmativePosition: clash.affirmativePosition,
      negativePosition: clash.negativePosition,
      status: clash.status as ClashStatus,
    })),
    recommendations: validated.recommendations,
    overallAssessment: validated.overallAssessment,
  };
};

/**
 * Generates a debate summary using the Gemini API.
 */
const generateSummaryFromAPI = async (
  topic: string,
  affirmativeArguments: Array<{
    speaker: string;
    content: string;
    type: string;
  }>,
  negativeArguments: Array<{ speaker: string; content: string; type: string }>,
): Promise<DebateSummary> => {
  if (!isGeminiConfigured()) {
    throw new Error(
      "Gemini API key is not configured. Please set VITE_GEMINI_API_KEY.",
    );
  }

  const model = getGeminiModel();
  const userMessage = formatDebateForPrompt(
    topic,
    affirmativeArguments,
    negativeArguments,
  );

  const prompt = `${DEBATE_SUMMARY_PROMPT}

${userMessage}

IMPORTANT: You MUST respond with ONLY a valid JSON object, no markdown formatting or code blocks. The JSON must match this structure exactly:
{
  "majorArguments": [{"side": "affirmative"|"negative", "argument": "string", "strength": 0-100}],
  "areasOfClash": [{"topic": "string", "affirmativePosition": "string", "negativePosition": "string", "status": "resolved"|"contested"|"unaddressed"}],
  "recommendations": ["string"],
  "overallAssessment": "string"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const content = response.text();

  if (!content) {
    throw new Error("No response from Gemini API");
  }

  return parseAIResponse(content);
};

/**
 * Query key for debate summaries.
 */
export const DEBATE_SUMMARY_QUERY_KEY = ["debateSummary"] as const;

/**
 * Hook for generating AI-powered debate summaries.
 * Supports auto-generation when debate content changes.
 *
 * @returns Object containing:
 * - summary: The generated DebateSummary or null
 * - isLoading: Whether a summary is being generated
 * - error: Any error that occurred during generation
 * - generateSummary: Function to trigger summary generation
 * - isConfigured: Whether Gemini is properly configured
 */
export const useDebateSummary = () => {
  const [summary, setSummary] = useState<DebateSummary | null>(null);
  const [lastContentHash, setLastContentHash] = useState<string>("");
  const currentDebate = useDebateStore((state) => state.currentDebate);
  const queryClient = useQueryClient();

  // Calculate a simple hash of debate content to detect changes
  const contentHash = useMemo(() => {
    if (!currentDebate) return "";
    const content = currentDebate.speakers
      .flatMap((s) => s.arguments.map((a) => a.content))
      .join("|");
    return `${currentDebate.topic}-${content.length}-${currentDebate.speakers.length}`;
  }, [currentDebate]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!currentDebate) {
        throw new Error("No active debate to summarize");
      }

      // Gather arguments by side
      const affirmativeArguments: Array<{
        speaker: string;
        content: string;
        type: string;
      }> = [];
      const negativeArguments: Array<{
        speaker: string;
        content: string;
        type: string;
      }> = [];

      for (const speaker of currentDebate.speakers) {
        const targetArray =
          speaker.side === SIDES.AFFIRMATIVE
            ? affirmativeArguments
            : negativeArguments;

        for (const arg of speaker.arguments) {
          if (arg.content.trim()) {
            targetArray.push({
              speaker: speaker.name,
              content: arg.content,
              type: arg.type || "note",
            });
          }
        }
      }

      if (affirmativeArguments.length === 0 && negativeArguments.length === 0) {
        throw new Error("No arguments recorded in the debate yet");
      }

      return generateSummaryFromAPI(
        currentDebate.topic,
        affirmativeArguments,
        negativeArguments,
      );
    },
    onSuccess: (data) => {
      setSummary(data);
      setLastContentHash(contentHash);
      // Invalidate any cached summaries
      queryClient.invalidateQueries({ queryKey: DEBATE_SUMMARY_QUERY_KEY });
    },
  });

  const generateSummary = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  const clearSummary = useCallback(() => {
    setSummary(null);
    mutation.reset();
  }, [mutation]);

  // Auto-generate summary when content changes significantly
  // Uses debounce to avoid too many API calls
  useEffect(() => {
    if (!isGeminiConfigured()) return;
    if (!currentDebate) return;
    if (mutation.isPending) return;

    // Check if we have enough content to generate
    const totalArgs = currentDebate.speakers.reduce(
      (sum, s) => sum + s.arguments.filter((a) => a.content.trim()).length,
      0,
    );

    // Only auto-generate if we have at least 2 arguments and content has changed
    if (totalArgs < 2) return;
    if (contentHash === lastContentHash) return;

    // Debounce the auto-generation
    const timeout = setTimeout(() => {
      generateSummary();
    }, 3000); // 3 second debounce

    return () => clearTimeout(timeout);
  }, [
    contentHash,
    lastContentHash,
    currentDebate,
    mutation.isPending,
    generateSummary,
  ]);

  return {
    summary,
    isLoading: mutation.isPending,
    error: mutation.error,
    generateSummary,
    clearSummary,
    isConfigured: isGeminiConfigured(),
  };
};
