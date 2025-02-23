import { useState, useEffect } from "react";
import { Phone, MessageSquare, User, Send } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/lib/notification";

// Mock data for demonstration
const MOCK_CHATS = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "When can we expect the delivery?",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Support Group",
    lastMessage: "New update available!",
    time: "9:45 AM",
    unread: 0,
  },
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
}

export function WhatsAppView() {
  const [selectedChat, setSelectedChat] = useState<typeof MOCK_CHATS[0] | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { addNotification } = useNotifications();

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate response after 1 second
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message. I'll get back to you soon.",
        sender: "other",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);

      // Add notification
      addNotification({
        title: `New Message from ${selectedChat.name}`,
        message: response.content,
        platform: 'whatsapp'
      });
    }, 1000);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-4rem)]">
      {/* Chat List Sidebar */}
      <Card className="col-span-3 h-full">
        <CardHeader className="pb-4">
          <CardTitle>Chats</CardTitle>
          <CardDescription>Recent conversations</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {MOCK_CHATS.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedChat?.id === chat.id ? "bg-accent" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  setMessages([]); // Reset messages when changing chat
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="col-span-9 h-full">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{selectedChat.name}</CardTitle>
                  <CardDescription>Online</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}