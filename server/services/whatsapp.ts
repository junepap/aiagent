
import type { Message } from "@shared/schema";

// Mock WhatsApp service for now
export async function getWhatsAppMessages(): Promise<Message[]> {
  return [
    {
      id: 1,
      platform: "whatsapp",
      externalId: "wa_1",
      content: "Hello, I need help with my order",
      summary: "Customer service inquiry",
      sentiment: 3,
      priority: 2,
      processed: true,
      metadata: { phone: "+1234567890" },
      createdAt: new Date(),
    }
  ];
}

export async function sendWhatsAppMessage(content: string, to: string): Promise<void> {
  console.log(`Sending WhatsApp message: ${content} to ${to}`);
}
import type { Message } from "@shared/schema";
import { storage } from "../storage";
import { summarizeText, analyzeSentiment, detectPriority, generateResponse } from "./ai";
import { Twilio } from 'twilio';

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function getWhatsAppMessages(): Promise<Message[]> {
  try {
    const messages = await client.messages.list({
      to: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`
    });

    const processedMessages = await Promise.all(messages.map(async (msg) => {
      const summary = await summarizeText(msg.body);
      const sentiment = await analyzeSentiment(msg.body);
      const priority = await detectPriority(msg.body);

      return {
        platform: 'whatsapp',
        externalId: msg.sid,
        content: msg.body,
        summary,
        sentiment,
        priority,
        processed: true,
        metadata: {
          from: msg.from,
          status: msg.status,
          timestamp: msg.dateCreated
        },
        createdAt: new Date(msg.dateCreated)
      };
    }));

    return processedMessages;
  } catch (error) {
    console.error('Error fetching WhatsApp messages:', error);
    return [];
  }
}

export async function sendWhatsAppMessage(to: string, content: string): Promise<boolean> {
  try {
    await client.messages.create({
      body: content,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`
    });
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}
