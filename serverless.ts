import { functions } from "./serverless-config/functions";
import { AWS } from "@serverless/typescript";
import {
  cognitoCreateUserRoles,
  cognitoListUserPoolPolicies,
} from "./aws-config/roles";
import { resources } from "./serverless-config/resources";

const serverlessConfiguration = {
  service: "lambda", // Replace with your service name
  frameworkVersion: "3",

  plugins: ["serverless-offline", "serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "il-central-1",
    stage: "DEV",
    profile: "default", // Replace with your AWS profile name
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      APP_CLIENT_ID: "6r8d5bgr5mf7ahm08rptia1um1",
      DB_TABLE_NAME: "guyLeifer-users",
      LOGGER_ENABLE: "true",
      AUTH_FLOW_TYPE: "USER_PASSWORD_AUTH",
    },
    iam: {
      role: {
        statements: [cognitoListUserPoolPolicies, cognitoCreateUserRoles],
      },
    },
  },
  functions,
  resources,
};

module.exports = serverlessConfiguration;
