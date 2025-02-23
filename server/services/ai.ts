
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function summarizeText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "No text provided to summarize.";
  }
  try {
    const result = await model.generateContent(`Summarize this text concisely: ${text}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in summarizeText:', error);
    return "Error generating summary.";
  }
}

export async function analyzeSentiment(text: string): Promise<number> {
  if (!text || text.trim().length === 0) {
    return 3; // Neutral sentiment for empty text
  }
  try {
    const result = await model.generateContent(
      `Analyze the sentiment of this text and return only a number from 1-5 (1 being very negative, 5 being very positive): ${text}`
    );
    const response = await result.response;
    return parseInt(response.text().trim()) || 3;
  } catch (error) {
    console.error('Error in analyzeSentiment:', error);
    return 3;
  }
}

export async function detectPriority(text: string): Promise<number> {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  try {
    const result = await model.generateContent(
      `Rate the urgency/priority of this text from 0-2 (0 being low, 1 being medium, 2 being high). Return only the number: ${text}`
    );
    const response = await result.response;
    return parseInt(response.text().trim()) || 0;
  } catch (error) {
    console.error('Error in detectPriority:', error);
    return 0;
  }
}

export async function generateResponse(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "Cannot generate response for empty text.";
  }
  try {
    const result = await model.generateContent(
      `Generate a concise, professional response to this message: ${text}`
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return "Error generating response.";
  }
}

export async function generateDailyDigest(messages: string[]): Promise<string> {
  if (!messages || messages.length === 0) {
    return "No messages to digest.";
  }
  try {
    const result = await model.generateContent(
      `Create a concise daily digest summarizing these messages: ${messages.join("\n")}`
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in generateDailyDigest:', error);
    return "Error generating digest.";
  }
}
