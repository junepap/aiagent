
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
