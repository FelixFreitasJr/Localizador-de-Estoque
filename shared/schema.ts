import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  locationExternal: text("location_external"),
  locationSatellite: text("location_satellite"),
  quantityExternal: integer("quantity_external").default(0),
  quantitySatellite: integer("quantity_satellite").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertItemSchema = createInsertSchema(items).omit({ 
  id: true, 
  lastUpdated: true 
});

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
