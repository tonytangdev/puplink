import {
  pgTable,
  varchar,
  timestamp,
  text,
  boolean,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const files = pgTable("files", {
  id: varchar("id").primaryKey(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  fileType: text("file_type").notNull(),
  maxOpenings: integer("max_openings").notNull().default(1),
  maxOpeningReached: boolean("max_opening_reached").notNull().default(false),
});

export const insertFileSchema = createInsertSchema(files);

export const selectFileSchema = createSelectSchema(files);

export const updateFileSchema = createInsertSchema(files).pick({
  updatedAt: true,
  maxOpeningReached: true,
});

export const openings = pgTable("openings", {
  id: varchar("id").primaryKey(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  fileId: varchar("file_id")
    .references(() => files.id)
    .notNull(),
});

export const insertOpeningSchema = createInsertSchema(openings);

export const selectOpeningSchema = createSelectSchema(openings);

