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
      description: 'The 3-5 strongest arguments from each side',
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
            description: 'A concise summary of the argument (1-2 sentences)',
          },
          strength: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Strength score based on evidence, logic, and impact (0-100)',
          },
        },
        required: ['side', 'argument', 'strength'],
      },
    },
    areasOfClash: {
      type: 'array',
      description: 'Areas where arguments directly clash or respond to each other',
      items: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'The specific issue or point being contested',
          },
          affirmativePosition: {
            type: 'string',
            description: "The affirmative side's position on this topic",
          },
          negativePosition: {
            type: 'string',
            description: "The negative side's position on this topic",
          },
          status: {
            type: 'string',
            enum: ['resolved', 'contested', 'unaddressed'],
            description: 'Whether the clash has been resolved, is still contested, or remains unaddressed',
          },
        },
        required: ['topic', 'affirmativePosition', 'negativePosition', 'status'],
      },
    },
    recommendations: {
      type: 'array',
      description: 'Actionable recommendations for both sides',
      items: {
        type: 'string',
        description: 'A specific, actionable recommendation',
      },
    },
    overallAssessment: {
      type: 'string',
      description: 'A brief overall assessment of the debate state (2-3 sentences)',
    },
  },
  required: ['majorArguments', 'areasOfClash', 'recommendations', 'overallAssessment'],
} as const;

/**
 * System prompt for analyzing Congressional debates.
 * Instructs the AI to identify major arguments, areas of clash, and provide recommendations.
 */
export const DEBATE_SUMMARY_PROMPT = `You are an expert Congressional Debate analyst and flow judge. Your task is to analyze a debate round and provide a comprehensive summary.

## Your Analysis Should Include:

### 1. Major Arguments (3-5 from each side)
Identify the strongest arguments made by each side. Consider:
- Quality of evidence and warrants
- Logical coherence
- Strategic importance to the resolution
- Potential for impact in voters' decisions

Rate each argument's strength from 0-100 based on:
- Evidence quality (30%)
- Logical reasoning (30%)
- Impact/significance (25%)
- Delivery/presentation context (15%)

### 2. Areas of Clash
Find where arguments directly clash or respond to each other:
- Identify specific contested issues
- Note each side's position
- Determine the status:
  - "resolved" = One side clearly won this point
  - "contested" = Both sides have valid competing claims
  - "unaddressed" = One or both sides haven't fully engaged

### 3. Recommendations
Provide specific, actionable recommendations:
- What the affirmative should address in remaining speeches
- What the negative should address in remaining speeches
- Key arguments that need extension or defense
- Dropped arguments that should be picked up
- Strategic pivots that could strengthen each side

### 4. Overall Assessment
Summarize the current state of the debate:
- Which side appears ahead and why
- What the key voting issues are likely to be
- What could change the trajectory

## Response Format
Return your analysis as a JSON object matching the provided schema. Be concise but thorough.

## Important Guidelines:
- Be objective and balanced in your analysis
- Focus on the substance of arguments, not speaker style
- Consider the resolution/topic context
- Identify implicit clashes even if not directly stated
- Recommend both offensive and defensive strategies`;

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
