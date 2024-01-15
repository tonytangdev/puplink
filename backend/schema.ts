import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const files = pgTable("files", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  openedAt: timestamp("opened_at"),
  fileType: text("file_type").notNull(),
});

export const insertFileSchema = createInsertSchema(files);

export const selectFileSchema = createSelectSchema(files);
