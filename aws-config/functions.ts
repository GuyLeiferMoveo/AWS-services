import { iamRoleStatements, moveoRuleARN } from "./roles";

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
    iamRoleStatements,
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
        },
      },
    ],
  },
};
