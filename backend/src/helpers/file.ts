import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  files,
  insertFileSchema,
  insertOpeningSchema,
  openings,
  updateFileSchema,
} from "../../schema";
import { count, eq } from "drizzle-orm";

const connectionString = process.env.SUPBASE_DB_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

export async function getFile(id: string) {
  const selectedFiles = await db
    .select()
    .from(files)
    .where(eq(files.id, id))
    .execute();
  if (selectedFiles.length === 0) {
    throw new Error("File not found");
  }

  const file = selectedFiles[0];
  return file;
}

export async function createFile(id: string, fileType: string = "unknown") {
  const values = insertFileSchema.parse({
    id: id,
    fileType: fileType,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const file = await db.insert(files).values(values).execute();

  return file;
}

export async function updateFile(
  id: string,
  maxOpeningReached: boolean = false
) {
  const values = updateFileSchema.parse({
    id: id,
    updatedAt: new Date(),
    maxOpeningReached: maxOpeningReached,
  });

  return await db.update(files).set(values).where(eq(files.id, id)).execute();
}

export async function getNumberOfOpenings(id: string) {
  return await db
    .select({ value: count(openings.id) })
    .from(openings)
    .where(eq(openings.id, id))
    .execute();
}

export async function createOpening(id: string, fileId: string) {
  const values = insertOpeningSchema.parse({
    id: id,
    fileId: fileId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const opening = await db.insert(openings).values(values).execute();

  return opening;
}
