import OpenAI from 'openai';

/**
 * OpenAI client instance configured with the API key from environment variables.
 * 
 * @remarks
 * The API key should be set in the environment variable VITE_OPENAI_API_KEY.
 * In development, this can be done via a .env file.
 */
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

/**
 * Checks if the OpenAI API key is configured.
 */
export const isOpenAIConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY);
};
