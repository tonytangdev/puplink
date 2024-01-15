import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { files, insertFileSchema } from "../../schema";

const connectionString = process.env.SUPBASE_DB_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

export async function createFile(
  id: string,
  fileType: string = "unknown"
) {
  const values = insertFileSchema.parse({
    id: id,
    fileType: fileType,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const file = await db.insert(files).values(values).execute();

  return file;
}
