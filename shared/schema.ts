import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  locationExternal: text("location_external"),
  locationSatellite: text("location_satellite"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertItemSchema = createInsertSchema(items).omit({ 
  id: true, 
  lastUpdated: true 
});

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
