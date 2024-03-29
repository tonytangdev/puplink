import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { uploadFile } from "../helpers/s3";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { createFile } from "../helpers/file";

export const handler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const { body } = event;
  if (!body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "No file provided",
      }),
    };
  }

  try {
    // remove until first comma if there is one
    let toConvert = body.split(",")[1] ?? body;

    // string base64 -> Buffer
    const buffer = Buffer.from(toConvert, "base64");
    const id = uuidv4(); // should always be unique
    const fileExtension = (await fileTypeFromBuffer(buffer))?.ext;
    const fileName = `${id}.${fileExtension}`;

    await uploadFile(fileName, buffer);
    await createFile(id, fileExtension);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "File uploaded successfully",
        data: {
          id,
        },
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    };
  }
};
