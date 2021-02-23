import { observable } from "mobx";
import { isOpendexdLocked, isOpendexdReady } from "../common/utils/serviceUtil";
import { Status } from "../models/Status";

export type Details = {
  opendexdStatus?: Status;
};

export type ServiceStore = ReturnType<typeof useServiceStore>;

export const SERVICE_STORE = "serviceStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useServiceStore = (defaultDetails: Details) => {
  const store = observable({
    details: defaultDetails,
    get opendexdStatus(): Status | undefined {
      return store.details.opendexdStatus;
    },
    setOpendexdStatus(value: Status | undefined): void {
      store.details.opendexdStatus = value;
    },
    get opendexdLocked(): boolean | undefined {
      return store.details.opendexdStatus
        ? isOpendexdLocked(store.details.opendexdStatus)
        : undefined;
    },
    get opendexdReady(): boolean | undefined {
      return store.details.opendexdStatus
        ? isOpendexdReady(store.details.opendexdStatus)
        : undefined;
    },
  });

  return store;
};
