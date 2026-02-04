/**
 * AI prompt templates for debate analysis.
 */

/**
 * JSON schema for structured debate summary output.
 * This schema is used to ensure the AI returns properly formatted data.
 */
export const DEBATE_SUMMARY_SCHEMA = {
  type: 'object',
  properties: {
    majorArguments: {
      type: 'array',
      description: 'ALL arguments that were actually made by each side (typically 1-3 per side unless more were explicitly stated)',
      items: {
        type: 'object',
        properties: {
          side: {
            type: 'string',
            enum: ['affirmative', 'negative'],
            description: 'Which side made the argument',
          },
          argument: {
            type: 'string',
            description: 'Direct summary using the speaker\'s actual words and concepts - DO NOT elaborate or add unstated implications',
          },
          strength: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Strength score based ONLY on: argument length/detail (40%), evidence provided (30%), strategic position (20%), direct clash (10%)',
          },
          speakerNames: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of speaker names who made this argument',
          },
        },
        required: ['side', 'argument', 'strength', 'speakerNames'],
      },
    },
    areasOfClash: {
      type: 'array',
      description: 'ONLY areas where arguments actually and explicitly clash or respond to each other (look for REF tags)',
      items: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'The specific issue being contested using actual terms from the debate',
          },
          affirmativePosition: {
            type: 'string',
            description: "What the affirmative side ACTUALLY SAID on this topic",
          },
          negativePosition: {
            type: 'string',
            description: "What the negative side ACTUALLY SAID on this topic",
          },
          status: {
            type: 'string',
            enum: ['resolved', 'contested', 'unaddressed'],
            description: 'Whether the clash has been resolved, is still contested, or remains unaddressed based on what was actually said',
          },
        },
        required: ['topic', 'affirmativePosition', 'negativePosition', 'status'],
      },
    },
    recommendations: {
      type: 'array',
      description: 'Actionable recommendations based on what\'s missing or weak in the actual arguments made (typically 3-6 recommendations)',
      items: {
        type: 'string',
        description: 'A specific, actionable recommendation based on actual gaps in the debate',
      },
    },
    overallAssessment: {
      type: 'string',
      description: 'A brief overall assessment of the debate state (1-2 concise sentences that reference specific speakers by name)',
    },
  },
  required: ['majorArguments', 'areasOfClash', 'recommendations', 'overallAssessment'],
} as const;

/**
 * System prompt for analyzing Congressional debates.
 * Instructs the AI to identify major arguments, areas of clash, and provide recommendations.
 */
export const DEBATE_SUMMARY_PROMPT = `You are an expert Congressional Debate flow judge. Your task is to analyze ONLY what was actually said in the debate.

## CRITICAL RULES - READ CAREFULLY:
1. ONLY summarize arguments that were EXPLICITLY stated in the debate
2. DO NOT infer, extrapolate, or add context that wasn't directly mentioned
3. DO NOT use words or concepts that weren't actually said by the speakers
4. Quote or paraphrase the ACTUAL language used, not what you think they meant
5. If an argument is short or simple, keep your summary short and simple
6. Base strength scores ONLY on what's visible in the actual text

## Your Analysis Should Include:

### 1. Major Arguments (only list arguments actually made)
For each argument, DIRECTLY summarize what was actually said:
- Use the speaker's actual words and phrasing as much as possible
- Include the names of ALL speakers who made this argument in the speakerNames array
- DO NOT elaborate beyond what they stated
- If an argument is one sentence, your summary should be roughly one sentence
- DO NOT add implications, warrants, or impacts they didn't explicitly state

Rate each argument's strength from 0-100 based ONLY on what they actually said:
- Length and detail of the argument (40%)
- Whether evidence or reasoning was provided (30%)
- Strategic positioning (20%)
- Direct clash with opposing arguments (10%)

### 2. Areas of Clash
ONLY identify clashes that ACTUALLY exist in the debate:
- Look for explicit refutations (REF tags, direct responses)
- Use the ACTUAL language from each side
- DO NOT create clash points that weren't directly addressed
- Status should reflect what actually happened, not theoretical analysis

### 3. Recommendations
Based ONLY on what's missing or weak in the actual arguments:
- Point out arguments that need more development
- Identify dropped refutations
- Note where more evidence/warrants are needed
- DO NOT suggest sophisticated strategies if the debate is simple

### 4. Overall Assessment
Provide a concise 1-2 sentence summary using ONLY information from the actual debate:
- Reference what specific speakers actually said
- Be honest about the level of development in the debate
- DO NOT embellish or make the debate sound more sophisticated than it is

## Response Format
Return your analysis as a JSON object matching the provided schema.

## REMEMBER: 
- If speakers made simple arguments, your summary should be simple
- DO NOT add concepts, theories, or terminology they didn't use
- Stick to the ACTUAL TEXT of what was said
- Be accurate, not creative`;

/**
 * Formats debate data into a user message for the AI.
 */
export const formatDebateForPrompt = (
  topic: string,
  affirmativeArguments: Array<{ speaker: string; content: string; type: string }>,
  negativeArguments: Array<{ speaker: string; content: string; type: string }>
): string => {
  const formatArguments = (
    args: Array<{ speaker: string; content: string; type: string }>
  ): string => {
    if (args.length === 0) return 'No arguments recorded yet.';
    return args
      .map((arg, i) => `${i + 1}. [${arg.type.toUpperCase()}] ${arg.speaker}: "${arg.content}"`)
      .join('\n');
  };

  return `## Debate Resolution
"${topic}"

## Affirmative Arguments
${formatArguments(affirmativeArguments)}

## Negative Arguments
${formatArguments(negativeArguments)}

Please analyze this debate and provide a comprehensive summary following the specified format.`;
};
