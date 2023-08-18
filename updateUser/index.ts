import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { dynamoDb } from "../aws-config/dynamoDB";
import { APIGatewayProxyHandler } from "aws-lambda";
import {
  isUserAuthenticatedAuthorizer,
  unauthorizedResponse,
} from "../utils/authorizer";
import { createResponse } from "../aws-config/apiGetway";
import {
  validateIsraeliID,
  validateIsraeliPhoneNumber,
  validateRequest,
  validateStringMaxLength,
} from "../utils/validations";

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

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!isUserAuthenticatedAuthorizer(event)) return unauthorizedResponse;

  try {
    const { valid, message } = validateRequest(event, validations);
    if (!valid) throw new Error(message);

    const requestBody = event.body || "";
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

    const updateParams: CognitoIdentityServiceProvider.UpdateUserAttributesRequest =
      {
        // AccessToken: event.requestContext.authorizer?.claims.jti, // TODO - fix
        AccessToken: event.headers.Authorization?.split(" ")[1] || "",
        UserAttributes: UserAttributes,
      };

    const updateResponse = await cognitoIdentityServiceProvider
      .updateUserAttributes(updateParams)
      .promise();

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.DB_TABLE_NAME || "",
      Key: {
        userId: requestBodyJson.userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return createResponse(200, result.Attributes || {});
  } catch (error: any) {
    return createResponse(500, { error: error.message });
  }
};

const validations: Record<string, (value: string) => boolean> = {
  firstName: (value: string) => validateStringMaxLength(value, 20),
  lastName: (value: string) => validateStringMaxLength(value, 20),
  password: (value: string) => validateStringMaxLength(value, 20),
  phoneNumber: (value: string) => validateIsraeliPhoneNumber(value),
  userId: (value: string) => validateIsraeliID(value),
};
