import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, messages, aiModels } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User, InsertUser, Message, InsertMessage, AiModel, InsertAiModel } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable must be set");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByPlatform(platform: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageProcessingStatus(id: number, processed: boolean): Promise<void>;

  // AI Model operations
  getAiModel(id: number): Promise<AiModel | undefined>;
  getActiveAiModels(): Promise<AiModel[]>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  updateAiModelStatus(id: number, active: boolean): Promise<void>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async getMessagesByPlatform(platform: string): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.platform, platform))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessageProcessingStatus(id: number, processed: boolean): Promise<void> {
    await db.update(messages)
      .set({ processed })
      .where(eq(messages.id, id));
  }

  async getAiModel(id: number): Promise<AiModel | undefined> {
    const result = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
    return result[0];
  }

  async getActiveAiModels(): Promise<AiModel[]> {
    return await db.select().from(aiModels).where(eq(aiModels.active, true));
  }

  async createAiModel(model: InsertAiModel): Promise<AiModel> {
    const result = await db.insert(aiModels).values(model).returning();
    return result[0];
  }

  async updateAiModelStatus(id: number, active: boolean): Promise<void> {
    await db.update(aiModels)
      .set({ active })
      .where(eq(aiModels.id, id));
  }
}

export const storage = new PostgresStorage();