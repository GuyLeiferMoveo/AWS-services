import { APIGatewayProxyHandler } from "aws-lambda";
import { createTableIfNotExists } from "../aws-config/dynamoDB";
import { createResponse } from "../aws-config/apiGetway";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const dynamoDbTable = await createTableIfNotExists();
    return createResponse(200, { dynamoDbTable: dynamoDbTable });
  } catch (error: any) {
    return createResponse(400, { error: error.message });
  }
};
