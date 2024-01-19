import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import {
  createOpening,
  getFile,
  getNumberOfOpenings,
  updateFile,
} from "../helpers/file";
import { v4 as uuidv4 } from "uuid";

type Event = {
  fileId: string;
};

export const handler: Handler<APIGatewayProxyEventV2 & Event> = async (
  event
) => {
  try {
    const { fileId } = event;
    if (!fileId) {
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

    const value = await getNumberOfOpenings(fileId);
    const numberOfOpenings = value[0].value + 1;
    const file = await getFile(fileId);
    const maxOpenings = file.maxOpenings;

    const id = uuidv4(); // should always be unique
    await createOpening(id, fileId);

    if (numberOfOpenings === maxOpenings) {
      await updateFile(fileId, true);
    }

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
