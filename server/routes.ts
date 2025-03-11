import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { chatMessageSchema } from "@shared/schema";
import { searchWikipedia } from "../client/src/lib/wikiService";

export async function registerRoutes(app: Express) {
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages/clear", async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ message: "Chat history cleared" });
    } catch (error) {
      console.error("Error clearing messages:", error);
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const result = chatMessageSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid message format" });
        return;
      }

      // Store user's message
      const userMessage = await storage.createMessage({
        content: result.data.content,
        isUserMessage: true,
        country: result.data.country,
        category: result.data.category
      });

      // Get comprehensive legal information
      const legalInfo = await searchWikipedia(
        `${result.data.category} ${result.data.content}`,
        result.data.country
      );

      // Store and return bot's response
      const botMessage = await storage.createMessage({
        content: legalInfo,
        isUserMessage: false,
        country: result.data.country,
        category: result.data.category
      });

      res.json([userMessage, botMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  return createServer(app);
}