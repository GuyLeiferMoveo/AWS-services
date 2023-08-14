import { logger } from "../utils/logger";

export const validateStringMaxLength = (
  value: string,
  length: number
): boolean => {
  const respone = value.length > length;
  if (!respone) logger(value, length);
  return respone;
};

export const validateStringMinLength = (
  value: string,
  length: number
): boolean => {
  const respone = value.length < length;
  if (!respone) logger(value, length);
  return respone;
};

export const validateIsraeliPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(05)[0-9]{8}$/;
  const respone = phoneRegex.test(phoneNumber);
  if (!respone) logger("phoneNumber", phoneNumber);
  return respone;
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
