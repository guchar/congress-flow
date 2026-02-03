import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI client instance configured with the API key from environment variables.
 *
 * @remarks
 * The API key should be set in the environment variable VITE_GEMINI_API_KEY.
 * In development, this can be done via a .env file.
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Get the Gemini model instance.
 * Using gemini-2.0-flash-lite which is widely available.
 */
export const getGeminiModel = () => {
  if (!genAI) {
    throw new Error("Gemini API key is not configured");
  }
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
};

/**
 * Checks if the Gemini API key is configured.
 */
export const isGeminiConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
};
