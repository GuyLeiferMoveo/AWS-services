import { moveoRuleARN } from "../aws-config/roles";

export const functions = {
  userPool: {
    handler: "userPool/index.handler",
    role: moveoRuleARN,
    events: [
      {
        http: {
          method: "post",
          path: "userPool",
        },
      },
    ],
  },
  dynamoDb: {
    handler: "dynamoDb/index.handler",
    role: moveoRuleARN,
    events: [
      {
        http: {
          method: "post",
          path: "dynamoDb",
        },
      },
    ],
  },
  postUser: {
    handler: "postUser/index.handler",
    role: moveoRuleARN,
    events: [
      {
        http: {
          method: "post",
          path: "user",
        },
      },
    ],
    // iamRoleStatements: [cognitoCreateUserRoles],
  },
  getUser: {
    handler: "getUser/index.handler",
    role: moveoRuleARN,
    events: [
      {
        http: {
          method: "get",
          path: "user",
        },
      },
    ],
  },
  userLogin: {
    handler: "userLogin/index.handler",
    role: moveoRuleARN,
    events: [
      {
        http: {
          method: "post",
          path: "user/login",
        },
      },
    ],
  },
  updateUser: {
    handler: "updateUser/index.handler",
    role: moveoRuleARN,
    events: [
      {
        http: {
          method: "put",
          path: "user",
          authorizer: {
            type: "COGNITO_USER_POOLS",
            authorizerId: { Ref: "MyCognitoAuthorizer" },
          },
        },
      },
    ],
  },
};
