import { 
  type User, 
  type InsertUser, 
  type Campaign, 
  type InsertCampaign,
  type Winner,
  type InsertWinner 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Campaign methods
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  getActiveCampaign(): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;

  // Winner methods
  getWinners(campaignId?: string): Promise<Winner[]>;
  createWinner(winner: InsertWinner): Promise<Winner>;
  getCampaignWinner(campaignId: string): Promise<Winner | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private campaigns: Map<string, Campaign>;
  private winners: Map<string, Winner>;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.winners = new Map();

    // Initialize with sample campaign for development
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create a sample campaign that matches our current UI
    const sampleCampaign: Campaign = {
      id: randomUUID(),
      sponsorName: "TechFlow Pro",
      sponsorTagline: "Revolutionizing Digital Innovation",
      sponsorWebsite: "https://example.com",
      posterUrl: "/attached_assets/generated_images/Tech_sponsor_ad_poster_de2247ee.png",
      secretCode: "TECH2024WIN",
      mysteryDescription: "🎁 Mystery Prize Awaits! Be the first to tell VideoWalker this secret code and win an amazing surprise gift worth over $200!",
      prizeValue: "$200+",
      countdownEnd: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      isActive: true,
      hasWinner: false,
      createdAt: new Date(),
    };
    this.campaigns.set(sampleCampaign.id, sampleCampaign);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getActiveCampaign(): Promise<Campaign | undefined> {
    const campaigns = Array.from(this.campaigns.values());
    return campaigns.find(campaign => 
      campaign.isActive && 
      campaign.countdownEnd > new Date() && 
      !campaign.hasWinner
    );
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = { 
      ...insertCampaign, 
      id, 
      createdAt: new Date(),
      isActive: true,
      hasWinner: false,
      prizeValue: insertCampaign.prizeValue || null
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Winner methods
  async getWinners(campaignId?: string): Promise<Winner[]> {
    const winners = Array.from(this.winners.values());
    if (campaignId) {
      return winners.filter(winner => winner.campaignId === campaignId);
    }
    return winners;
  }

  async createWinner(insertWinner: InsertWinner): Promise<Winner> {
    const id = randomUUID();
    const winner: Winner = { 
      ...insertWinner, 
      id, 
      wonAt: new Date(),
      winnerEmail: insertWinner.winnerEmail || null,
      winnerPhone: insertWinner.winnerPhone || null
    };
    this.winners.set(id, winner);

    // Mark campaign as having a winner
    await this.updateCampaign(winner.campaignId, { hasWinner: true });

    return winner;
  }

  async getCampaignWinner(campaignId: string): Promise<Winner | undefined> {
    const winners = Array.from(this.winners.values());
    return winners.find(winner => winner.campaignId === campaignId);
  }
}

export const storage = new MemStorage();
