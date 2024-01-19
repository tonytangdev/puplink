import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { generateDownloadSignedUrl } from "../helpers/s3";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { getFile } from "../helpers/file";

const { REGION, DESTROY_LAMBDA } = process.env;
const lambdaClient = new LambdaClient({ region: REGION });

type Body = {
  fileId?: string;
};

export const handler: Handler<APIGatewayProxyEventV2> = async (event) => {
  const { fileId = "" } = JSON.parse(event.body ?? "") as Body;
  if (!fileId) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "No ID provided",
      }),
    };
  }

  try {
    const file = await getFile(fileId);
    if (file.maxOpeningReached) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Max opening reached",
        }),
      };
    }

    const url = await generateDownloadSignedUrl(fileId, file.fileType);

    const lambdaCommand = new InvokeCommand({
      FunctionName: DESTROY_LAMBDA,
      Payload: JSON.stringify({ fileId: fileId }),
      InvocationType: "Event",
    });

    await lambdaClient.send(lambdaCommand);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Able to download file",
        data: {
          url,
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
