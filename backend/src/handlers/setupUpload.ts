import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { generateUploadSignedUrl } from "../helpers/s3";
import { v4 as uuidv4 } from "uuid";

type Body = {
  fileExtension: string;
};

export const handler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const { fileExtension } = JSON.parse(event.body ?? "") as Body;
  if (!fileExtension) {
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
    const id = uuidv4(); // should always be unique

    const presignedUrl = await generateUploadSignedUrl(
      `${id}.${fileExtension}`
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "success",
        data: {
          url: presignedUrl,
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
