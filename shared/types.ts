export interface PlatformStats {
  totalMessages: number;
  unreadMessages: number;
  processedMessages: number;
  averageSentiment: number;
}

export interface AIResponse {
  summary: string;
  sentiment: number;
  priority: number;
  suggestedResponse?: string;
}

export type Platform = 'gmail' | 'slack' | 'whatsapp';

export interface MessageThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  priority: number;
}
