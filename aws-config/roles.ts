export const moveoRuleARN =
  "arn:aws:iam::779000067130:role/Moveo-LambdaExecutionRole";

export const iamRoleStatements = [
  {
    Effect: "Allow",
    Action: [
      "cognito-idp:AdminCreateUser",
      "cognito-idp:AdminUpdateUserAttributes",
    ],
    Resource:
      "arn:aws:cognito-idp:eu-west-1:779000067130:userpool/eu-west-1_qKZ7VW7u4",
  },
];

export const cognitoListUserPoolsPolicy = {
  // Policy name, adjust as needed
  name: "CognitoListUserPoolsPolicy",
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: "cognito-idp:ListUserPools",
        Resource: "arn:aws:cognito-idp:eu-west-1:779000067130:userpool/*",
      },
    ],
  },
};
