import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI client instance configured with the API key from environment variables.
 *
 * @remarks
 * The API key should be set in the environment variable VITE_GEMINI_API_KEY.
 * In development, this can be done via a .env file.
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Simple rate limiter to prevent hitting API limits.
 * Enforces minimum 15 seconds between requests (Google free tier: 15 RPM).
 */
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 15_000; // 15 seconds between requests

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(
      `Rate limiter: waiting ${Math.round(
        waitTime / 1000
      )}s before next request...`
    );
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();
};

const getErrorStatus = (error: unknown): number | null => {
  if (!error || typeof error !== "object") return null;
  const status = (
    error as { status?: unknown; response?: { status?: unknown } }
  ).status;
  const responseStatus = (error as { response?: { status?: unknown } }).response
    ?.status;
  if (typeof status === "number") return status;
  if (typeof responseStatus === "number") return responseStatus;
  return null;
};

const normalizeGeminiError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error("Gemini API request failed.");
};

/**
 * Get the Gemini model instance.
 */
export const getGeminiModel = () => {
  if (!genAI) {
    throw new Error("Gemini API key is not configured");
  }
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Generates content with rate limiting (no retries to avoid cascading failures).
 * Google's free tier has strict limits - we fail fast and let the UI handle cooldowns.
 */
export const generateContentWithRetry = async (
  model: any,
  prompt: string,
  _maxRetries = 1 // Ignored - no retries to prevent rate limit cascade
) => {
  // Wait for rate limiter before making request
  await waitForRateLimit();

  try {
    return await model.generateContent(prompt);
  } catch (error: any) {
    const status = getErrorStatus(error);

    if (status === 429) {
      const rateLimitError = new Error(
        "Gemini API rate limited. Please wait 2 minutes before trying again."
      );
      rateLimitError.name = "RateLimitError";
      throw rateLimitError;
    }
    if (status === 400) {
      const badRequestError = new Error(
        "Gemini API request was rejected. Check your API key and model access."
      );
      badRequestError.name = "BadRequestError";
      throw badRequestError;
    }
    if (status === 503) {
      const serviceError = new Error(
        "Gemini API is temporarily unavailable. Please try again later."
      );
      serviceError.name = "ServiceUnavailableError";
      throw serviceError;
    }
    throw normalizeGeminiError(error);
  }
};

/**
 * Checks if the Gemini API key is configured.
 */
export const isGeminiConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
};
