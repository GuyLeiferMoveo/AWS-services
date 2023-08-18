import { DynamoDB } from "aws-sdk";
import { dynamoDb } from "../aws-config/dynamoDB";
import { APIGatewayProxyHandler } from "aws-lambda";
import { isUserAuthenticated, unauthorizedResponse } from "../utils/authorizer";
import { createResponse } from "../aws-config/apiGetway";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!(await isUserAuthenticated(event))) return unauthorizedResponse;
  try {
    const userId = event.queryStringParameters
      ? event.queryStringParameters.userId
      : "";

    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.DB_TABLE_NAME || "",
      Key: { userId },
    };

    const result = await dynamoDb.get(params).promise();
    return createResponse(200, result.Item || {});
  } catch (error: any) {
    return createResponse(500, { error: error.message });
  }
};
