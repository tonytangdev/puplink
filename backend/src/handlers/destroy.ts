import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { updateFile } from "../helpers/file";

type Body = {
  fileId: string;
};

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
    const { fileId } = JSON.parse(body) as Body;

    await updateFile(fileId);

    return {
      statusCode: 200,
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
