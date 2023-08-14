import { DynamoDB, CognitoIdentityServiceProvider } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { dynamoDb } from "../aws-config/dynamoDB";
import { logger } from "../utils/logger";
import {
  validateIsraeliID,
  validateIsraeliPhoneNumber,
  validateStringMaxLength,
  validateStringMinLength,
} from "./helpers";

export const handler = async (event: any) => {
  logger("event", event);

  const requestBody = JSON.parse(event.body);
  logger("requestBody", requestBody);
  const { firstName, lastName, email, password, phoneNumber, userId } =
    requestBody;
  try {
    logger("Start Validating");
    if (
      validateStringMaxLength(firstName, 20) ||
      validateStringMaxLength(lastName, 20) ||
      validateStringMinLength(password, 6)
    )
      throw new Error("Not valid params");
    if (!validateIsraeliPhoneNumber(phoneNumber))
      throw new Error("Not valid phone number");
    const phoneNumberWithCountryCode = "+972".concat(phoneNumber.substr(1));
    if (!validateIsraeliID(userId)) throw new Error("Not valid ID");
    logger("Validated Succesfully");

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
    logger("paramsForCognito", paramsForCognito);

    const user = await cognitoIdentityServiceProvider
      .signUp(paramsForCognito)
      .promise();
    logger("user", user);

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
    logger("paramsForDDB", paramsForDDB);

    await dynamoDb.put(paramsForDDB).promise();

    const response = {
      statusCode: 201,
      body: JSON.stringify(paramsForDDB.Item.userId),
    };
    logger("response", response);

    return response;
  } catch (error: any) {
    logger("error", error);
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
    return response;
  }
};
