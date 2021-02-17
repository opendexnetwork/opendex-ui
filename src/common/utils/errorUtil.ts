export const getErrorMsg = (err: unknown): string => {
  if (typeof err == "string") {
    return err;
  }
  const message = (err as any)["message"];
  const messageStr = message ? message : JSON.stringify(err);
  if (messageStr.startsWith("rpc error") && messageStr.includes("desc =")) {
    const desc = messageStr.substring(messageStr.indexOf("desc ="));
    const messageStart = desc.indexOf("=") + 2;
    return desc.substring(messageStart);
  }
  return messageStr;
};

/**
 * Maps Boltz errors to user-friendly messages
 */
export const BOLTZ_ERROR_MESSAGES: { [error: string]: string } = {
  "rpc error: code = Unknown desc = checksum mismatch": "Invalid address",
  "rpc error: code = Unknown desc = decoded address is of unknown format":
    "Unknown address format",
};

/**
 * Maps opendexd errors to user-friendly messages
 */
export const OPENDEXD_ERROR_MESSAGES: { [error: string]: string } = {
  "rpc error: code = InvalidArgument desc = password is incorrect":
    "Incorrect password",
};
