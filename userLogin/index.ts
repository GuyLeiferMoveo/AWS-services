import { CognitoIdentityServiceProvider } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "../aws-config/apiGetway";
import {
  validateIsraeliID,
  validateRequest,
  validateStringMaxLength,
} from "../utils/validations";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { valid, message } = validateRequest(event, validations);
    if (!valid) throw new Error(message);

    const requestBody = JSON.parse(event.body!);
    const { username, password } = requestBody;

    const params: CognitoIdentityServiceProvider.InitiateAuthRequest = {
      AuthFlow: process.env.AUTH_FLOW_TYPE || "",
      ClientId: process.env.APP_CLIENT_ID || "",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    const response = await cognitoIdentityServiceProvider
      .initiateAuth(params)
      .promise();

    return createResponse(200, {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
    });
  } catch (error: any) {
    return createResponse(500, { error: error.message });
  }
};

const validations: Record<string, (value: string) => boolean> = {
  username: (value: string) => validateIsraeliID(value),
  password: (value: string) => validateStringMaxLength(value, 20),
};
