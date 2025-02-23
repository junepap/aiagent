import { WebClient } from "@slack/web-api";
import type { Message } from "@shared/schema";
import { summarizeText, analyzeSentiment } from "./ai";

// Mock data for when Slack credentials are not available
const MOCK_MESSAGES = [
  {
    ts: "1645567890.123456",
    text: "Team update: Project milestones achieved!",
    user: "U123456",
    username: "John Doe"
  },
  {
    ts: "1645567890.123457",
    text: "Great progress everyone! Looking forward to the next sprint.",
    user: "U123457",
    username: "Jane Smith"
  }
];

let slack: WebClient | null = null;

// Only initialize Slack client if credentials are available
if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) {
  slack = new WebClient(process.env.SLACK_BOT_TOKEN);
} else {
  console.warn("Slack credentials not found, using mock data");
}

export async function getChannelMessages(
  limit: number = 100
): Promise<Message[]> {
  try {
    let slackMessages;

    if (slack) {
      // Real Slack API call
      const result = await slack.conversations.history({
        channel: process.env.SLACK_CHANNEL_ID!,
        limit
      });
      slackMessages = result.messages || [];
    } else {
      // Use mock data
      slackMessages = MOCK_MESSAGES;
    }

    const messages: Message[] = [];

    for (const msg of slackMessages) {
      const summary = await summarizeText(msg.text || "");
      const sentiment = await analyzeSentiment(msg.text || "");

      messages.push({
        id: 0,
        platform: "slack",
        externalId: msg.ts || "",
        content: msg.text || "",
        summary,
        sentiment,
        priority: sentiment < 3 ? 1 : 0,
        processed: true,
        metadata: msg,
        createdAt: new Date()
      });
    }

    return messages;
  } catch (error) {
    console.error("Error fetching Slack messages:", error);
    return [];
  }
}

export async function sendMessage(text: string): Promise<void> {
  try {
    if (slack) {
      await slack.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID!,
        text
      });
    } else {
      console.log("Mock Slack message sent:", text);
    }
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error;
  }
}