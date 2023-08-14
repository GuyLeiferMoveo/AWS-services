import { CognitoIdentityServiceProvider, config as AWSConfig } from "aws-sdk";
import { logger } from "../utils/logger";
import {
  cognitoAppClientName,
  cognitoUserPool,
  cognitoUserPoolRegion,
} from "./constants";

export const cognitoIdentityServiceProvider =
  new CognitoIdentityServiceProvider({
    region: cognitoUserPoolRegion,
    apiVersion: "2016-04-18",
  });

const checkIfUserPollExists = async (cognitoUserPoolName: string) => {
  try {
    const listUserPoolsResponse = await cognitoIdentityServiceProvider
      .listUserPools({ MaxResults: 10 })
      .promise();

    const existingUserPool = listUserPoolsResponse.UserPools?.find(
      (pool: any) => pool.Name === cognitoUserPoolName
    );

    if (!existingUserPool)
      throw new Error(`User Pool ${cognitoUserPoolName} wasn't found`);

    logger("User Pool already exists. User Pool ID:", existingUserPool.Id);
    return existingUserPool.Id;
  } catch (error) {
    console.error("Error checking for existing User Pool:", error);
    return;
  }
};

const createUserPool = async (
  PoolName: string,
  UsernameAttributes: string[]
) => {
  try {
    const userPoolParams = {
      PoolName,
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireUppercase: true,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireSymbols: false,
        },
      },
      //   UsernameAttributes: ["email"],
      UsernameAttributes,
    };

    const userPoolResponse = await cognitoIdentityServiceProvider
      .createUserPool(userPoolParams)
      .promise();
    const userPoolId = userPoolResponse.UserPool?.Id;
    logger("User Pool ID:", userPoolId);
    return userPoolId;
  } catch (error) {
    console.error("Error checking for existing User Pool:", error);
    return;
  }
};

const checkIfUserPollAppClientExists = async (
  userPoolId: string,
  appClientName: string
) => {
  try {
    const listUserPoolClientsResponse = await cognitoIdentityServiceProvider
      .listUserPoolClients({ UserPoolId: userPoolId })
      .promise();

    const existingAppClient = listUserPoolClientsResponse.UserPoolClients?.find(
      (client) => client.ClientName === appClientName
    );

    if (existingAppClient) {
      logger(
        "App Client already exists. App Client ID:",
        existingAppClient.ClientId
      );
      return existingAppClient.ClientId;
    }
  } catch (error) {
    console.error("Error checking for existing User Pool:", error);
    return;
  }
};

const createUserPoolAppClient = async (userPoolId: string) => {
  try {
    const appClientParams: CognitoIdentityServiceProvider.Types.CreateUserPoolClientRequest =
      {
        UserPoolId: userPoolId,
        ClientName: "MyAppClient",
        GenerateSecret: false,
        AllowedOAuthFlowsUserPoolClient: true,
        AllowedOAuthFlows: ["code", "implicit"],
        AllowedOAuthScopes: ["phone", "email", "openid", "profile"],
        CallbackURLs: ["http://localhost:3000/callback"], // Replace with your callback URLs
        LogoutURLs: ["http://localhost:3000/logout"], // Replace with your logout URLs
      };

    const appClientResponse = await cognitoIdentityServiceProvider
      .createUserPoolClient(appClientParams)
      .promise();
    const appClientId = appClientResponse.UserPoolClient?.ClientId;

    logger("Created App Client. App Client ID:", appClientId);
    return appClientId;
  } catch (error) {
    console.error("Error checking for existing User Pool:", error);
    return;
  }
};

export const createUserPoolAndAppClient = async () => {
  try {
    AWSConfig.update({ region: cognitoUserPoolRegion });

    const userPoolId =
      (await checkIfUserPollExists(cognitoUserPool)) ||
      (await createUserPool(cognitoUserPool, ["email"]));

    if (!userPoolId)
      throw new Error(`User Pool ${cognitoUserPool} did not found or created`);

    const appClientId =
      (await checkIfUserPollAppClientExists(
        userPoolId,
        cognitoAppClientName
      )) || (await createUserPoolAppClient(userPoolId));
    return { userPoolId, appClientId };
  } catch (error) {
    console.error("Error creating User Pool:", error);
  }
};
