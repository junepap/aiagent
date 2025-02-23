import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


export async function summarizeText(text: string): Promise<string> {
  const result = await model.generateContent(`Summarize this text concisely: ${text}`);
  return result.response.text();
}

export async function analyzeSentiment(text: string): Promise<number> {
  const result = await model.generateContent(
    `Analyze the sentiment of this text and return only a number from 1-5 (1 being very negative, 5 being very positive): ${text}`
  );
  return parseInt(result.response.text().trim());
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