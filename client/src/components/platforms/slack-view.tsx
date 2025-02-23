import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Send, AlertCircle, Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Message } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function SlackView() {
  const [newMessage, setNewMessage] = useState("");

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/slack/messages"],
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await apiRequest("POST", "/api/slack/messages", { content: newMessage });
      await queryClient.invalidateQueries({ queryKey: ["/api/slack/messages"] });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 4) return "text-green-500";
    if (sentiment <= 2) return "text-red-500";
    return "text-yellow-500";
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return { label: "High Priority", color: "text-red-500" };
      case 2:
        return { label: "Medium Priority", color: "text-yellow-500" };
      default:
        return { label: "Low Priority", color: "text-green-500" };
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="h-[calc(100vh-4rem)]">
      <CardHeader>
        <CardTitle>Slack Channel</CardTitle>
        <CardDescription>
          Messages from the connected channel with AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-accent/50"
              >
                <MessageSquare className="h-5 w-5 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {(message.metadata as any)?.user || 'Unknown User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt || '').toLocaleTimeString()}
                    </span>
                    {message.priority === 1 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent>High Priority Message</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="mt-1">{message.content}</p>

                  {/* AI Insights Section */}
                  <div className="mt-2 space-y-2 text-sm">
                    {message.summary && (
                      <div className="bg-muted p-2 rounded">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Bot className="h-4 w-4" />
                          <span className="font-medium">AI Summary:</span>
                        </div>
                        <p>{message.summary}</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {message.sentiment && (
                        <span className={getSentimentColor(message.sentiment)}>
                          Sentiment: {message.sentiment}/5
                        </span>
                      )}
                      {message.priority && (
                        <span className={getPriorityLabel(message.priority).color}>
                          {getPriorityLabel(message.priority).label}
                        </span>
                      )}
                    </div>

                    {(message.metadata as any)?.suggestedResponse && (
                      <div className="bg-muted p-2 rounded mt-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Bot className="h-4 w-4" />
                          <span className="font-medium">Suggested Response:</span>
                        </div>
                        <p>{(message.metadata as any).suggestedResponse}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setNewMessage((message.metadata as any).suggestedResponse)}
                        >
                          Use Suggestion
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No messages yet
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}