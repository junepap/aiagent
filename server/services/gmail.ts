
import { google } from 'googleapis';
import type { Message } from "@shared/schema";
import { summarizeText, analyzeSentiment, detectPriority } from "./ai";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function getEmails(): Promise<Message[]> {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 100
    });

    const messages = await Promise.all(
      response.data.messages?.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id as string
        });

        const content = email.data.snippet || '';
        const summary = await summarizeText(content);
        const sentiment = await analyzeSentiment(content);
        const priority = await detectPriority(content);
        
        return {
          id: 0,
          platform: "gmail",
          externalId: email.data.id as string,
          content,
          summary,
          sentiment,
          priority,
          processed: true,
          metadata: {
            threadId: email.data.threadId,
            labelIds: email.data.labelIds,
            headers: email.data.payload?.headers
          },
          createdAt: new Date(parseInt(email.data.internalDate as string))
        };
      }) || []
    );

    return messages;
  } catch (error) {
    console.error('Error fetching Gmail messages:', error);
    return [];
  }
}

export async function sendEmail(to: string, subject: string, content: string): Promise<boolean> {
  try {
    const message = [
      'Content-Type: text/plain; charset="UTF-8"\r\n',
      'MIME-Version: 1.0\r\n',
      `To: ${to}\r\n`,
      `Subject: ${subject}\r\n\r\n`,
      content
    ].join('');

    const encodedMessage = Buffer.from(message).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

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
