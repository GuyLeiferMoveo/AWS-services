import {
  cognitoUserPoolAppClientName,
  cognitoUserPoolId,
  cognitoUserPoolName,
} from "../aws-config/constants";

export const resources = {
  Resources: {
    MyCognitoUserPool: {
      Type: "AWS::Cognito::UserPool",
      Properties: {
        UserPoolName: cognitoUserPoolName,
      },
    },
    MyCognitoUserPoolClient: {
      Type: "AWS::Cognito::UserPoolClient",
      Properties: {
        UserPoolId: { Ref: cognitoUserPoolId },
        ClientName: cognitoUserPoolAppClientName,
        GenerateSecret: false,
      },
    },
    MyCognitoAuthorizer: {
      Type: "AWS::ApiGateway::Authorizer",
      Properties: {
        Name: "my-cognito-authorizer",
        Type: "COGNITO_USER_POOLS",
        IdentitySource: "method.request.header.Authorization",
        RestApiId: { Ref: "ApiGatewayRestApi" },
        ProviderARNs: [{ "Fn::GetAtt": ["MyCognitoUserPool", "Arn"] }],
      },
    },
  },
};
