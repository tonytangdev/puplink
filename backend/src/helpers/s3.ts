import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export function generateUploadSignedUrl(path: string) {
  const { BUCKET_NAME } = process.env;

  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: path });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export function generateDownloadSignedUrl(id: string, extension: string) {
  const { BUCKET_NAME } = process.env;

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${id}.${extension}`,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 1200 });
}
