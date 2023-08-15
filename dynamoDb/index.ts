import { createTableIfNotExists } from "../aws-config/dynamoDB";
import { logger } from "../utils/logger";

export const handler = async (event: any) => {
  logger("event", event);
  try {
    const dynamoDbTable = await createTableIfNotExists();
    return {
      statusCode: 200,
      body: JSON.stringify({
        dynamoDbTable: dynamoDbTable?.$response,
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
