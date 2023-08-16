import { functions } from "./aws-config/functions";

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
      APP_CLIENT_ID: "4pivk3kih3m8tlgepnht69hb8a",
      DB_TABLE_NAME: "guyLeifer-users",
      LOGGER_ENABLE: true,
      AUTH_FLOW_TYPE: "USER_PASSWORD_AUTH",
    },
  },
  functions,
};

module.exports = serverlessConfiguration;
