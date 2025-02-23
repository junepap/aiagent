import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Star, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@shared/schema";

export function GmailView() {
  const [selectedEmail, setSelectedEmail] = useState<Message | null>(null);

  const { data: emails = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/gmail/messages"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-4rem)]">
      <div className="col-span-4 border-r">
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Manage your emails</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {emails.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No emails found
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 border-b cursor-pointer hover:bg-accent ${
                      selectedEmail?.id === email.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {(email.metadata as any)?.subject || 'No Subject'}
                      </h3>
                      {email.priority === 1 && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {email.content}
                    </p>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-8">
        {selectedEmail ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{(selectedEmail.metadata as any)?.subject || 'No Subject'}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                From: {(selectedEmail.metadata as any)?.from || 'Unknown Sender'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose max-w-none">
                  {selectedEmail.content}
                </div>
                {selectedEmail.summary && (
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">AI Summary</h4>
                    <p className="text-sm">{selectedEmail.summary}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select an email to view</p>
          </div>
        )}
      </div>
    </div>
  );
}