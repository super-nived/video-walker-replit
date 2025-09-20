import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// VideoWalker App Schema
export const advertisements = pgTable("advertisements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsorName: text("sponsor_name").notNull(),
  sponsorTagline: text("sponsor_tagline").notNull(),
  sponsorWebsite: text("sponsor_website").notNull(),
  posterUrl: text("poster_url").notNull(),
  giftTitle: text("gift_title").notNull(),
  giftDescription: text("gift_description").notNull(),
  giftImageUrl: text("gift_image_url").notNull(),
  secretCode: text("secret_code").notNull(),
  countdownStart: timestamp("countdown_start").notNull(),
  countdownEnd: timestamp("countdown_end").notNull(),
  isActive: boolean("is_active").default(false),
  hasWinner: boolean("has_winner").default(false),
  winnerName: text("winner_name"),
  winnerImageUrl: text("winner_image_url"),
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
});

export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;

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
