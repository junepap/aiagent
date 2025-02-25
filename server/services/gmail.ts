
import { google } from 'googleapis';
import type { Message } from "@shared/schema";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function getEmails(): Promise<Message[]> {
  try {
    const token = await storage.getGmailToken();
    if (!token) {
      throw new Error('Gmail not connected');
    }
    
    oauth2Client.setCredentials({ access_token: token });
    const response = await gmail.users.messages.list({ userId: 'me' });
    
    // Transform emails into messages
    const messages: Message[] = [];
    if (response.data.messages) {
      for (const msg of response.data.messages) {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!
        });
        
        messages.push({
          platform: 'gmail',
          externalId: email.data.id!,
          content: email.data.snippet || '',
          processed: false,
          metadata: email.data,
          createdAt: new Date()
        });
      }
    }
    
    return messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
}

export async function sendEmail(to: string, subject: string, message: string): Promise<boolean> {
  try {
    const token = await storage.getGmailToken();
    if (!token) {
      throw new Error('Gmail not connected');
    }
    
    oauth2Client.setCredentials({ access_token: token });
    
    const encodedMessage = Buffer.from(
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `\r\n` +
      `${message}`
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

import { storage } from '../storage';
