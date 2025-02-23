// For demo purposes, we'll mock the Gmail integration
import type { Message } from "@shared/schema";
import { summarizeText, analyzeSentiment } from "./ai";

const MOCK_EMAILS = [
  {
    id: "1",
    subject: "Project Update Meeting",
    content: "Let's schedule a meeting to discuss project progress.",
    from: "manager@company.com",
    date: new Date().toISOString()
  },
  {
    id: "2",
    subject: "Urgent: Server Issues",
    content: "We're experiencing downtime on production servers.",
    from: "devops@company.com",
    date: new Date().toISOString()
  }
];

export async function getEmails(): Promise<Message[]> {
  const messages: Message[] = [];
  
  for (const email of MOCK_EMAILS) {
    const summary = await summarizeText(email.content);
    const sentiment = await analyzeSentiment(email.content);
    
    messages.push({
      id: 0,
      platform: "gmail",
      externalId: email.id,
      content: email.content,
      summary,
      sentiment,
      priority: email.subject.toLowerCase().includes("urgent") ? 1 : 0,
      processed: true,
      metadata: email,
      createdAt: new Date(email.date)
    });
  }

  return messages;
}
