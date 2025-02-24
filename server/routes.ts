import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getEmails } from "./services/gmail";
import { getChannelMessages, sendMessage as sendSlackMessage } from "./services/slack";
import { getWhatsAppMessages, sendWhatsAppMessage } from "./services/whatsapp";
import { summarizeText, analyzeSentiment, detectPriority, generateResponse } from "./services/ai";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { createInsertSchema } from "drizzle-zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    next(err);
  });

  // Gmail routes
  app.get("/api/gmail/messages", async (req, res) => {
    try {
      const emails = await getEmails();
      for (const email of emails) {
        const insertMessage: InsertMessage = {
          platform: email.platform,
          externalId: email.externalId,
          content: email.content,
          summary: email.summary || null,
          sentiment: email.sentiment || null,
          priority: email.priority || null,
          processed: email.processed || false,
          metadata: email.metadata || null,
          createdAt: email.createdAt || new Date(),
        };
        await storage.createMessage(insertMessage);
      }
      const messages = await storage.getMessagesByPlatform("gmail");
      res.json(messages);
    } catch (error) {
      console.error("Gmail error:", error);
      res.status(500).json({ message: "Failed to fetch Gmail messages" });
    }
  });

  // Slack routes
  app.get("/api/slack/messages", async (req, res) => {
    try {
      const slackMessages = await getChannelMessages();
      for (const message of slackMessages) {
        const insertMessage: InsertMessage = {
          platform: message.platform,
          externalId: message.externalId,
          content: message.content,
          summary: message.summary || null,
          sentiment: message.sentiment || null,
          priority: message.priority || null,
          processed: message.processed || false,
          metadata: message.metadata || null,
          createdAt: message.createdAt || new Date(),
        };
        await storage.createMessage(insertMessage);
      }
      const messages = await storage.getMessagesByPlatform("slack");
      res.json(messages);
    } catch (error) {
      console.error("Slack error:", error);
      res.status(500).json({ message: "Failed to fetch Slack messages" });
    }
  });

  app.post("/api/slack/messages", async (req, res) => {
    try {
      const message: InsertMessage = {
        platform: "slack",
        externalId: Date.now().toString(),
        content: req.body.content,
        processed: false,
        metadata: null,
        createdAt: new Date(),
      };

      const sender = req.body.sender
      if (sender != undefined && sender === "self") {

        console.log("SENDER DETECTED")
        message.metadata = {
          ...message.metadata,
        }
      } else {
        // Enhanced AI processing with parallel execution for better performance
        const [summary, sentiment, priority] = await Promise.all([
          summarizeText(message.content),
          analyzeSentiment(message.content),
          detectPriority(message.content)
        ]);

        // Generate response suggestion if it's a high priority message
        let suggestedResponse = null;
        if (priority === 1) {
          suggestedResponse = await generateResponse(message.content);
        }

        message.summary = summary;
        message.sentiment = sentiment;
        message.priority = priority;
        message.metadata = {
          ...message.metadata,
          suggestedResponse
        };
      }

      // Save to database
      const savedMessage = await storage.createMessage(message);

      // Send to Slack
      await sendSlackMessage(req.body.content);

      res.json(savedMessage);
    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // WhatsApp routes
  app.get("/api/whatsapp/messages", async (req, res) => {
    try {
      const messages = await getWhatsAppMessages();
      for (const message of messages) {
        const insertMessage: InsertMessage = {
          platform: "whatsapp",
          externalId: message.externalId,
          content: message.content,
          summary: message.summary,
          sentiment: message.sentiment,
          priority: message.priority,
          processed: message.processed,
          metadata: message.metadata,
          createdAt: message.createdAt,
        };
        await storage.createMessage(insertMessage);
      }
      res.json(messages);
    } catch (error) {
      console.error("WhatsApp error:", error);
      res.status(500).json({ message: "Failed to fetch WhatsApp messages" });
    }
  });

  // Daily digest route
  app.get("/api/digest", async (req, res) => {
    try {
      const messages = await storage.getMessagesByDateRange(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date()
      );
      const digest = await generateDailyDigest(messages.map(m => m.content));
      res.json({ digest });
    } catch (error) {
      console.error("Digest error:", error);
      res.status(500).json({ message: "Failed to generate digest" });
    }
  });


  // AI Model routes
  app.get("/api/ai/models", async (req, res) => {
    try {
      const models = await storage.getActiveAiModels();
      res.json(models);
    } catch (error) {
      console.error("AI models error:", error);
      res.status(500).json({ message: "Failed to fetch AI models" });
    }
  });

  app.post("/api/ai/models", async (req, res) => {
    try {
      const model = await storage.createAiModel(req.body);
      res.json(model);
    } catch (error) {
      console.error("Error creating AI model:", error);
      res.status(500).json({ message: "Failed to create AI model" });
    }
  });

  app.patch("/api/ai/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateAiModelStatus(id, req.body.active);
      const model = await storage.getAiModel(id);
      res.json(model);
    } catch (error) {
      console.error("Error updating AI model:", error);
      res.status(500).json({ message: "Failed to update AI model" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}