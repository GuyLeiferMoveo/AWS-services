import { APIGatewayProxyResult } from "aws-lambda";

export const createResponse = (
  statusCode: number,
  body: Record<string, unknown>
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
});
