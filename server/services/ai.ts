import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


export async function summarizeText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "Original text not provided, so I cannot summarize it concisely.";
  }
  // TODO: Implement actual AI summarization
  return `Summary of: ${text.substring(0, 100)}...`;
}

export async function analyzeSentiment(text: string): Promise<number> {
  if (!text || text.trim().length === 0) {
    return 3; // Neutral sentiment for empty text
  }
  // TODO: Implement actual sentiment analysis
  return 3;
}

export async function detectPriority(text: string): Promise<number> {
  const result = await model.generateContent(
    `Analyze this message and return only a number from 1-3 (1 being urgent, 2 being normal, 3 being low priority): ${text}`
  );
  return parseInt(result.response.text().trim());
}

export async function generateResponse(text: string): Promise<string> {
  const result = await model.generateContent(
    `Generate a professional response to this message: ${text}`
  );
  return result.response.text();
}

export async function generateDailyDigest(messages: string[]): Promise<string> {
  const result = await model.generateContent(
    `Create a concise daily digest summarizing these messages: ${messages.join("\n")}`
  );
  return result.response.text();
}