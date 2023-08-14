import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { dynamoDb } from "../aws-config/dynamoDB";
import { logger } from "../utils/logger";

exports.handler = async (event: any) => {
  let accessToken = undefined;
  if (
    event.headers.Authorization &&
    event.headers.Authorization.split(" ").length === 2
  )
    accessToken = event.headers.Authorization.split(" ")[1];

  const authParams: CognitoIdentityServiceProvider.GetUserRequest = {
    AccessToken: accessToken,
  };
  logger("authParams", authParams);

  try {
    const authResponse = await cognitoIdentityServiceProvider
      .getUser(authParams)
      .promise();
    logger("authResponse", authResponse);

    if (!authResponse) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }

    const userId = event.queryStringParameters
      ? event.queryStringParameters.userId
      : "";
    logger("userId", userId);

    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.DB_TABLE_NAME || "",
      Key: {
        userId: userId,
      },
    };
    logger("params", params);

    const result = await dynamoDb.get(params).promise();
    logger("result", result);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    logger("response", response);

    return response;
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
