import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [isSlackConnected, setIsSlackConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  useEffect(() => {
    // Check initial Gmail connection status
    fetch("/api/auth/gmail/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setIsGmailConnected(true);
        }
      })
      .catch(() => {
        setConnectionStatus("");
      });

    // Check initial WhatsApp connection status
    fetch("/api/auth/whatsapp/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setIsWhatsAppConnected(true);
        }
      })
      .catch(() => {
        setConnectionStatus("");
      });

    // Check initial Slack connection status
    fetch("/api/auth/slack/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setIsSlackConnected(true);
        }
      })
      .catch(() => {
        setConnectionStatus("");
      });

    // Listen for auth success message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GMAIL_AUTH_SUCCESS") {
        setIsGmailConnected(true);
        setConnectionStatus("Gmail connected successfully!");
      } else if (event.data.type === "WHATSAPP_AUTH_SUCCESS") {
        setIsWhatsAppConnected(true);
        setConnectionStatus("WhatsApp connected successfully!");
      } else if (event.data.type === "SLACK_AUTH_SUCCESS") {
        setIsSlackConnected(true);
        setConnectionStatus("Slack connected successfully!");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setLocation]);

  const handleGmailAuth = () => {
    try {
      const width = 600;
      const height = 700;
      const left = Math.max(0, (window.innerWidth - width) / 2);
      const top = Math.max(0, (window.innerHeight - height) / 2);

      const popup = window.open(
        "/api/auth/gmail",
        "Gmail Authentication",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        setConnectionStatus(
          "Popup blocked. Please allow popups and try again.",
        );
      }
    } catch (error) {
      console.error("Error opening auth window:", error);
      setConnectionStatus("Failed to open authentication window");
    }
  };

  const handleWhatsAppAuth = () => {
    try {
      const width = 600;
      const height = 700;
      const left = Math.max(0, (window.innerWidth - width) / 2);
      const top = Math.max(0, (window.innerHeight - height) / 2);

      const popup = window.open(
        "/api/auth/whatsapp",
        "WhatsApp Authentication",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        setConnectionStatus(
          "Popup blocked. Please allow popups and try again.",
        );
      }
    } catch (error) {
      console.error("Error opening auth window:", error);
      setConnectionStatus("Failed to open authentication window");
    }
  };

  const handleSlackAuth = () => {
    try {
      const width = 600;
      const height = 700;
      const left = Math.max(0, (window.innerWidth - width) / 2);
      const top = Math.max(0, (window.innerHeight - height) / 2);

      const popup = window.open(
        "/api/auth/slack",
        "Slack Authentication",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        setConnectionStatus(
          "Popup blocked. Please allow popups and try again.",
        );
      }
    } catch (error) {
      console.error("Error opening auth window:", error);
      setConnectionStatus("Failed to open authentication window");
    }
  };

  useEffect(() => {
    if (isGmailConnected && isWhatsAppConnected && isSlackConnected) {
      localStorage.setItem("hasCompletedOnboarding", "true");
      setTimeout(() => setLocation("/"), 1500);
    }
  }, [isGmailConnected, isWhatsAppConnected, isSlackConnected, setLocation]);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            Let's set up your communication channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Gmail</h3>
              <p className="text-sm text-gray-500">
                Connect your Gmail account
              </p>
            </div>
            {isGmailConnected ? (
              <p className="text-green-500">Connected</p>
            ) : (
              <Button onClick={handleGmailAuth}>Connect Gmail</Button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">WhatsApp</h3>
              <p className="text-sm text-gray-500">
                Connect your WhatsApp Business account
              </p>
            </div>
            {isWhatsAppConnected ? (
              <p className="text-green-500">Connected</p>
            ) : (
              <Button onClick={handleWhatsAppAuth}>Connect WhatsApp</Button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Slack</h3>
              <p className="text-sm text-gray-500">
                Connect your Slack account
              </p>
            </div>
            {isSlackConnected ? (
              <p className="text-green-500">Connected</p>
            ) : (
              <Button onClick={handleSlackAuth}>Connect Slack</Button>
            )}
          </div>
          {connectionStatus && (
            <p
              className={`text-sm ${connectionStatus.includes("Success") ? "text-green-500" : "text-red-500"}`}
            >
              {connectionStatus}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
