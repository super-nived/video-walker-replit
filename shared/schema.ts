import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// VideoWalker App Schema - Sponsor Campaigns
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsorName: text("sponsor_name").notNull(),
  sponsorTagline: text("sponsor_tagline").notNull(),
  sponsorWebsite: text("sponsor_website").notNull(),
  posterUrl: text("poster_url").notNull(),
  secretCode: text("secret_code").notNull(),
  mysteryDescription: text("mystery_description").notNull(),
  prizeValue: text("prize_value"), // e.g., "$200", "Premium Package"
  countdownEnd: timestamp("countdown_end").notNull(),
  isActive: boolean("is_active").default(true),
  hasWinner: boolean("has_winner").default(false),
  winnerImageUrl: text("winner_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Winners table for tracking who won each campaign
export const winners = pgTable("winners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull().references(() => campaigns.id),
  winnerName: text("winner_name").notNull(),
  winnerEmail: text("winner_email"),
  winnerPhone: text("winner_phone"),
  wonAt: timestamp("won_at").defaultNow(),
  codeUsed: text("code_used").notNull(),
});

// Campaign schemas
export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export const insertWinnerSchema = createInsertSchema(winners).omit({
  id: true,
  wonAt: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertWinner = z.infer<typeof insertWinnerSchema>;
export type Winner = typeof winners.$inferSelect;

// Keep existing user schema for admin auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
