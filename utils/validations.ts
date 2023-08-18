import { APIGatewayProxyEvent } from "aws-lambda";

export const validateRequest = (
  event: APIGatewayProxyEvent,
  validations: Record<string, (value: string) => boolean>
): { valid: boolean; message?: string } => {
  if (!event.body) return { valid: false, message: "Not valid request body" };

  const requestBody: Record<string, string> = JSON.parse(event.body);
  for (const key in requestBody) {
    const value = requestBody[key];
    const validationFunction = validations[key];
    if (validationFunction && !validationFunction(value))
      return { valid: false, message: `Not valid ${key} - ${value}` };
  }

  return { valid: true };
};

export const validateStringMaxLength = (
  value: string,
  length: number
): boolean => value.length < length;

export const validateStringMinLength = (
  value: string,
  length: number
): boolean => value.length > length;

export const validateIsraeliPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(05)[0-9]{8}$/;
  return phoneRegex.test(phoneNumber);
};

export const validateIsraeliID = (id: string): boolean => {
  id = String(id).trim();
  if (id.length > 9) return false;
  id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
  return (
    Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) %
      10 ===
    0
  );
};
