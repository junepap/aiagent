import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.status === 429) { // Rate limit error
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

export async function summarizeText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "No text provided for summarization";
  }

  try {
    return await retryWithBackoff(async () => {
      // Structure the prompt to be more directive
      const prompt = `Task: Summarize the following text concisely while preserving key information.

Requirements:
- Extract main points and key details
- Maintain original meaning
- Keep summary clear and concise
- Use professional language

Text to summarize:
${text}

Summary:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      if (!summary || summary.includes("Please provide the text")) {
        throw new Error("Invalid API response");
      }

      return summary;
    });
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Failed to generate summary. Please try again.";
  }
}

export async function analyzeSentiment(text: string): Promise<number> {
  try {
    return await retryWithBackoff(async () => {
      const prompt = `Analyze the sentiment of the following text and respond with only a number from 1 to 5, where 1 is very negative and 5 is very positive:\n\n${text}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const sentimentText = response.text();
      // Extract the first number from the response
      const sentiment = parseInt(sentimentText.match(/\d+/)?.[0] || "3");
      return Math.max(1, Math.min(5, sentiment)); // Ensure the value is between 1 and 5
    });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 3; // Return neutral sentiment as fallback
  }
}

export async function generateResponse(text: string): Promise<string> {
  try {
    return await retryWithBackoff(async () => {
      const prompt = `Generate a professional and empathetic response to the following message. Keep the response concise and relevant:\n\n${text}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || "Could not generate response";
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return "Failed to generate response";
  }
}

export async function detectPriority(text: string): Promise<number> {
  try {
    return await retryWithBackoff(async () => {
      const prompt = `Analyze this message and determine its priority level. Consider urgency, importance, and time-sensitivity. Respond with only a number from 1 to 3, where:
      1 = High priority (urgent, immediate attention needed)
      2 = Medium priority (important but not urgent)
      3 = Low priority (routine communication)

      Message: ${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const priorityText = response.text();
      const priority = parseInt(priorityText.match(/\d+/)?.[0] || "3");
      return Math.max(1, Math.min(3, priority));
    });
  } catch (error) {
    console.error("Error detecting priority:", error);
    return 3; // Return low priority as fallback
  }
}