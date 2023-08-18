import { APIGatewayProxyHandler } from "aws-lambda";
import { createUserPoolAndAppClient } from "../aws-config/cognito";
import { createResponse } from "../aws-config/apiGetway";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userPoolDetails = await createUserPoolAndAppClient();
    return createResponse(200, {
      userPoolId: userPoolDetails?.userPoolId,
      appClientId: userPoolDetails?.appClientId,
    });
  } catch (error: any) {
    return createResponse(400, { error: error.message });
  }
};
