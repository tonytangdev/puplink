import { jest, it, expect, describe, afterEach } from "@jest/globals";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { uploadFile } from "./s3";
const BUCKET_NAME = "my-bucket";

jest.mock("@aws-sdk/client-s3");

describe("uploadFile", () => {
  const oldEnv = process.env;

  afterEach(() => {
    process.env = oldEnv;
  });

  it("should upload a file to S3", async () => {
    process.env.BUCKET_NAME = BUCKET_NAME;

    // Arrange
    const fileName = "test.txt";
    const fileContent = "This is a test file";

    // Act
    await uploadFile(fileName, fileContent);

    // Assert
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
    });
    expect(S3Client.prototype.send).toHaveBeenCalled();
  });
});
