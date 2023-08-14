import { CognitoIdentityServiceProvider } from "aws-sdk";
import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { logger } from "../utils/logger";

exports.handler = async (event: any) => {
  const requestBody = JSON.parse(event.body);
  logger("requestBody", requestBody);
  const { username, password } = requestBody;

  const params: CognitoIdentityServiceProvider.InitiateAuthRequest = {
    AuthFlow: process.env.AUTH_FLOW_TYPE || "",
    ClientId: process.env.APP_CLIENT_ID || "",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  logger("params", params);

  try {
    const response = await cognitoIdentityServiceProvider
      .initiateAuth(params)
      .promise();
    logger("response", response);

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
