export const moveoRuleARN =
  "arn:aws:iam::779000067130:role/Moveo-LambdaExecutionRole";

export const cognitoCreateUserRoles = {
  Effect: "Allow",
  Action: [
    "cognito-idp:AdminCreateUser",
    "cognito-idp:AdminUpdateUserAttributes",
  ],
  Resource:
    "arn:aws:cognito-idp:eu-west-1:779000067130:userpool/eu-west-1_qKZ7VW7u4",
};

export const cognitoListUserPoolPolicies = {
  Effect: "Allow",
  Action: ["cognito-idp:ListUserPools", "cognito-idp:CreateUserPool"],
  Resource: "arn:aws:cognito-idp:eu-west-1:779000067130:userpool/*",
};
