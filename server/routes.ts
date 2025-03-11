import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { chatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const result = chatMessageSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid message format" });
      return;
    }

    const userMessage = await storage.createMessage({
      content: result.data.content,
      isUserMessage: true,
      country: result.data.country,
      category: result.data.category
    });

    // Generate mock response
    const botMessage = await storage.createMessage({
      content: `Legal advice for ${result.data.category} in ${result.data.country}: According to local regulations, ${result.data.content}...`,
      isUserMessage: false,
      country: result.data.country,
      category: result.data.category
    });

    res.json([userMessage, botMessage]);
  });

  return createServer(app);
}
