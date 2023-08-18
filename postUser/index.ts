import { DynamoDB, CognitoIdentityServiceProvider } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { dynamoDb } from "../aws-config/dynamoDB";
import { APIGatewayProxyHandler } from "aws-lambda";
import {
  validateIsraeliID,
  validateIsraeliPhoneNumber,
  validateRequest,
  validateStringMaxLength,
} from "../utils/validations";
import { createResponse } from "../aws-config/apiGetway";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { valid, message } = validateRequest(event, validations);
    if (!valid) throw new Error(message);

    const requestBody = JSON.parse(event.body!);
    const { firstName, lastName, email, password, phoneNumber, userId } =
      requestBody;
    const phoneNumberWithCountryCode = "+972".concat(phoneNumber.substr(1));
    // Create params for signUp method
    const paramsForCognito: CognitoIdentityServiceProvider.SignUpRequest = {
      ClientId: process.env.APP_CLIENT_ID || "",
      Password: password,
      Username: userId,
      UserAttributes: [
        // {
        //   Name: "family_name",
        //   Value: lastName,
        // },
        {
          Name: "email",
          Value: email,
        },
        // {
        //   Name: "given_name",
        //   Value: firstName,
        // },
        // {
        //   Name: "phone_number",
        //   Value: phoneNumberWithCountryCode,
        // },
        // {
        //   Name: "custom:user_id",
        //   Value: userId,
        // },
      ],
    };

    const user = await cognitoIdentityServiceProvider
      .signUp(paramsForCognito)
      .promise();

    const paramsForDDB: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.DB_TABLE_NAME || "",
      Item: {
        id: userId,
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phoneNumberWithCountryCode,
        userId,
      },
    };

    await dynamoDb.put(paramsForDDB).promise();

    return createResponse(201, paramsForDDB.Item.userId);
  } catch (error: any) {
    return createResponse(400, { error: error.message });
  }
};

const validations: Record<string, (value: string) => boolean> = {
  firstName: (value: string) => validateStringMaxLength(value, 20),
  lastName: (value: string) => validateStringMaxLength(value, 20),
  password: (value: string) => validateStringMaxLength(value, 20),
  phoneNumber: (value: string) => validateIsraeliPhoneNumber(value),
  userId: (value: string) => validateIsraeliID(value),
};
