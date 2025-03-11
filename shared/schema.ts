import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  country: text("country").notNull(),
  category: text("category").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  isUserMessage: true,
  country: true,
  category: true
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const chatMessageSchema = z.object({
  content: z.string().min(1),
  country: z.string().min(1),
  category: z.string().min(1)
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;