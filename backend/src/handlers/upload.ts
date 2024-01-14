import { APIGatewayProxyEventV2, Handler } from "aws-lambda";

export const handler: Handler<APIGatewayProxyEventV2> = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World!",
    }),
  };
};
