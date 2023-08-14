export const logger = (logName: string, logValue: any = "") => {
  if (process.env.LOGGER_ENABLE) console.log(logName, logValue);
};
