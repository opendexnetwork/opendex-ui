import { observable } from "mobx";
import { ConnectionType } from "../enums";

export type Details = {
  connectionType?: ConnectionType;
};

export type ElectronStore = ReturnType<typeof useElectronStore>;

export const ELECTRON_STORE = "electronStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useElectronStore = (defaultDetails: Details) => {
  const store = observable({
    details: defaultDetails,
    get connectionType(): ConnectionType | undefined {
      return store.details.connectionType;
    },
    setConnectionType(value: ConnectionType): void {
      store.details.connectionType = value;
    },
  });

  return store;
};
