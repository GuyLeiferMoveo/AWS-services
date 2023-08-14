import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { dynamoDb } from "../aws-config/dynamoDB";
import { logger } from "../utils/logger";

const bodyIndex: any = {
  firstName: {
    cognito: "given_name",
    ddb: "firstName",
  },
  lastName: {
    cognito: "family_name",
    ddb: "lastName",
  },
  phoneNumber: {
    cognito: "phone_number",
    ddb: "phoneNumber",
  },
};

exports.handler = async (event: any) => {
  let accessToken = undefined;
  if (
    event.headers.Authorization &&
    event.headers.Authorization.split(" ").length === 2
  )
    accessToken = event.headers.Authorization.split(" ")[1];

  const authParams = {
    AccessToken: accessToken,
  };

  try {
    const authResponse = await cognitoIdentityServiceProvider
      .getUser(authParams)
      .promise();
    if (!authResponse) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
      };
    }

    const requestBody = event.body;
    const requestBodyJson = JSON.parse(requestBody);

    const detailsToUpdate = { ...requestBodyJson };
    delete detailsToUpdate.userId;

    const UserAttributes: any[] = [];
    const expressionAttributeValues: any = {};
    let updateExpression = "SET ";

    Object.entries(detailsToUpdate).forEach(([key, value], index) => {
      UserAttributes.push({
        Name: bodyIndex[key].cognito,
        Value: value,
      });
      const val = `:val${index}`;
      expressionAttributeValues[val] = value;
      updateExpression += `${bodyIndex[key].ddb} = ${val}, `;
    });

    updateExpression = updateExpression.slice(0, -2);

    logger("UserAttributes", UserAttributes);
    logger("expressionAttributeValues", expressionAttributeValues);
    logger("updateExpression", updateExpression);

    const updateParams: CognitoIdentityServiceProvider.UpdateUserAttributesRequest =
      {
        AccessToken: accessToken,
        UserAttributes: UserAttributes,
      };
    logger("updateParams", updateParams);

    const updateResponse = await cognitoIdentityServiceProvider
      .updateUserAttributes(updateParams)
      .promise();
    logger("updateResponse", updateResponse);

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.DB_TABLE_NAME || "",
      Key: {
        userId: requestBodyJson.userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };
    logger("params", params);

    const result = await dynamoDb.update(params).promise();
    logger("result", result);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    logger("response", response);

    return response;
  } catch (error: any) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
    return response;
  }
};
