import { XUD_NOT_READY } from "../constants";
import { Status } from "../models/Status";

export const isServiceReady = (status: Status): boolean => {
  return (
    status.status.startsWith("Ready") ||
    (status.service === "xud" && isXudReady(status)) ||
    (status.service === "boltz" &&
      [...status.status.matchAll(new RegExp("down", "g"))].length === 1)
  );
};

export const isXudLocked = (status: Status): boolean =>
  status.status.startsWith("Wallet locked");

export const isXudReady = (status: Status): boolean =>
  !XUD_NOT_READY.some((str) => status.status.startsWith(str));
