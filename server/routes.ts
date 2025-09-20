import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertWinnerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to get campaigns" });
    }
  });

  app.get("/api/campaigns/active", async (req, res) => {
    try {
      const activeCampaign = await storage.getActiveCampaign();
      if (!activeCampaign) {
        return res.status(404).json({ error: "No active campaign found" });
      }
      res.json(activeCampaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to get active campaign" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to get campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const parsedCampaign = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(parsedCampaign);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ error: "Invalid campaign data" });
    }
  });

  // Winner routes
  app.get("/api/winners", async (req, res) => {
    try {
      const campaignId = req.query.campaignId as string;
      const winners = await storage.getWinners(campaignId);
      res.json(winners);
    } catch (error) {
      res.status(500).json({ error: "Failed to get winners" });
    }
  });

  app.post("/api/winners", async (req, res) => {
    try {
      const parsedWinner = insertWinnerSchema.parse(req.body);
      
      // Check if campaign exists and secret code matches
      const campaign = await storage.getCampaign(parsedWinner.campaignId);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      if (campaign.hasWinner) {
        return res.status(400).json({ error: "Campaign already has a winner" });
      }

      if (campaign.secretCode !== parsedWinner.codeUsed) {
        return res.status(400).json({ error: "Invalid secret code" });
      }

      if (campaign.countdownEnd < new Date()) {
        return res.status(400).json({ error: "Campaign has expired" });
      }

      const winner = await storage.createWinner(parsedWinner);
      res.status(201).json(winner);
    } catch (error) {
      res.status(400).json({ error: "Invalid winner data" });
    }
  });

  app.get("/api/campaigns/:id/winner", async (req, res) => {
    try {
      const winner = await storage.getCampaignWinner(req.params.id);
      if (!winner) {
        return res.status(404).json({ error: "No winner found for this campaign" });
      }
      res.json(winner);
    } catch (error) {
      res.status(500).json({ error: "Failed to get campaign winner" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
