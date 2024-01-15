import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { uploadFile } from "../helpers/s3";

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
  await uploadFile("img.png", buffer);

  return {
    statusCode: 200,
  };
};
