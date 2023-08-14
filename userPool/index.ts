import { createUserPoolAndAppClient } from "../aws-config/cognito";
import { logger } from "../utils/logger";

export const handler = async (event: any) => {
  logger("event", event);
  try {
    const userPoolDetails = await createUserPoolAndAppClient();
    return {
      statusCode: 200,
      body: JSON.stringify({
        userPoolId: userPoolDetails?.userPoolId,
        appClientId: userPoolDetails?.appClientId,
      }),
    };
  } catch (error: any) {
    logger("error", error);
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
    return response;
  }
};
