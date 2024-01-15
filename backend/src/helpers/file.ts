import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { files, insertFileSchema, updateFileSchema } from "../../schema";
import { eq } from "drizzle-orm";

const connectionString = process.env.SUPBASE_DB_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

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

export async function updateFile(id: string) {
  const values = updateFileSchema.parse({
    id: id,
    updatedAt: new Date(),
    openedAt: new Date(),
  });

  return await db.update(files).set(values).where(eq(files.id, id)).execute();
}
