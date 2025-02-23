import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // gmail, slack, whatsapp
  externalId: text("external_id").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  sentiment: integer("sentiment"),
  priority: integer("priority"),
  processed: boolean("processed").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  endpoint: text("endpoint").notNull(),
  apiKey: text("api_key").notNull(),
  active: boolean("active").default(false),
});

export const insertUserSchema = createInsertSchema(users);
export const insertMessageSchema = createInsertSchema(messages);
export const insertAiModelSchema = createInsertSchema(aiModels);

export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AiModel = typeof aiModels.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertAiModel = z.infer<typeof insertAiModelSchema>;
