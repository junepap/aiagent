import axios from 'axios';
import type { Message } from "@shared/schema";
import { summarizeText, analyzeSentiment, detectPriority } from "./ai";

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const api = axios.create({
  baseURL: WHATSAPP_API_URL,
  headers: {
    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export async function getWhatsAppMessages(): Promise<Message[]> {
  try {
    const response = await api.get(`/${WHATSAPP_PHONE_NUMBER_ID}/messages`);
    const messages = response.data.data;

    return await Promise.all(messages.map(async (msg: any) => {
      const summary = await summarizeText(msg.text.body);
      const sentiment = await analyzeSentiment(msg.text.body);
      const priority = await detectPriority(msg.text.body);

      return {
        platform: 'whatsapp',
        externalId: msg.id,
        content: msg.text.body,
        summary,
        sentiment,
        priority,
        processed: true,
        metadata: {
          from: msg.from,
          status: msg.status,
          timestamp: msg.timestamp
        },
        createdAt: new Date(msg.timestamp)
      };
    }));
  } catch (error) {
    console.error('Error fetching WhatsApp messages:', error);
    return [];
  }
}

export async function sendWhatsAppMessage(to: string, content: string): Promise<boolean> {
  try {
    await api.post(`/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        body: content
      }
    });
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}