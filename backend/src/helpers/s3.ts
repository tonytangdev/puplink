import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { REGION } = process.env;
const s3Client = new S3Client({ region: REGION });

export function uploadFile(fileName: string, fileContent: Buffer) {
  const { BUCKET_NAME } = process.env;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  });

  return s3Client.send(command);
}
