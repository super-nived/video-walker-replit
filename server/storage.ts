import { 
  type User, 
  type InsertUser, 
  type Campaign, 
  type InsertCampaign,
  type Winner,
  type InsertWinner,
  users,
  campaigns,
  winners
} from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, desc } from "drizzle-orm";

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

// Database-backed storage implementation
export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
    
    // Initialize sample data for development
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    try {
      // Check if we already have campaigns
      const existingCampaigns = await this.db.select().from(campaigns).limit(1);
      if (existingCampaigns.length > 0) {
        return; // Sample data already exists
      }

      // Create a sample campaign that matches our current UI
      await this.db.insert(campaigns).values({
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
      });
    } catch (error) {
      console.log('Sample data initialization skipped (tables may not exist yet)');
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return await this.db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const result = await this.db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0];
  }

  async getActiveCampaign(): Promise<Campaign | undefined> {
    const result = await this.db
      .select()
      .from(campaigns)
      .where(
        and(
          eq(campaigns.isActive, true),
          eq(campaigns.hasWinner, false)
        )
      )
      .orderBy(desc(campaigns.createdAt))
      .limit(1);
    
    // Filter by countdown end date in JavaScript since complex date comparisons might vary by SQL dialect
    const campaign = result[0];
    if (campaign && campaign.countdownEnd && campaign.countdownEnd > new Date()) {
      return campaign;
    }
    return undefined;
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const result = await this.db.insert(campaigns).values({
      ...insertCampaign,
      isActive: true,
      hasWinner: false,
    }).returning();
    return result[0];
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const result = await this.db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return result[0];
  }

  // Winner methods
  async getWinners(campaignId?: string): Promise<Winner[]> {
    if (campaignId) {
      return await this.db
        .select()
        .from(winners)
        .where(eq(winners.campaignId, campaignId))
        .orderBy(desc(winners.wonAt));
    }
    return await this.db.select().from(winners).orderBy(desc(winners.wonAt));
  }

  async createWinner(insertWinner: InsertWinner): Promise<Winner> {
    // Use a transaction to ensure atomicity - create winner and mark campaign as having winner
    return await this.db.transaction(async (tx) => {
      // Create the winner
      const winnerResult = await tx.insert(winners).values(insertWinner).returning();
      const winner = winnerResult[0];

      // Mark campaign as having a winner
      await tx
        .update(campaigns)
        .set({ hasWinner: true })
        .where(eq(campaigns.id, insertWinner.campaignId));

      return winner;
    });
  }

  async getCampaignWinner(campaignId: string): Promise<Winner | undefined> {
    const result = await this.db
      .select()
      .from(winners)
      .where(eq(winners.campaignId, campaignId))
      .limit(1);
    return result[0];
  }
}

export const storage = new DatabaseStorage();
