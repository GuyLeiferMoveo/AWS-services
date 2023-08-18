import { cognitoIdentityServiceProvider } from "../aws-config/cognito";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const isUserAuthenticated = async (
  event: APIGatewayProxyEvent
): Promise<boolean> => {
  const AccessToken = event.headers.Authorization?.split(" ")[1];
  if (!AccessToken) return false;

  const authResponse = await cognitoIdentityServiceProvider
    .getUser({ AccessToken })
    .promise();
  if (!authResponse) return false;

  return true;
};

export const isUserAuthenticatedAuthorizer = (
  event: APIGatewayProxyEvent
): boolean => {
  const user = event.requestContext.authorizer;
  if (!user) return false;
  if (!user.claims) return false;
  return true;
};

export const unauthorizedResponse: APIGatewayProxyResult = {
  statusCode: 401,
  body: JSON.stringify({
    error: "Unauthorized",
  }),
};
