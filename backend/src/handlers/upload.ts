import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { uploadFile } from "../helpers/s3";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";

export const handler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const { body } = event;
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No file provided",
      }),
    };
  }

  // string base64 -> Buffer
  const buffer = Buffer.from(body, "base64");
  const id = uuidv4(); // should always be unique
  const fileExtension = (await fileTypeFromBuffer(buffer))?.ext;
  const fileName = `${id}.${fileExtension}`;

  await uploadFile(fileName, buffer);

  return {
    statusCode: 200,
  };
};
