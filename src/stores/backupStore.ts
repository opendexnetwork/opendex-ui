import { observable } from "mobx";
import { BackupInfo } from "../models/BackupInfo";

export type Details = {
  backupInfoLoaded: boolean;
  defaultPassword?: boolean;
  mnemonicShown?: boolean;
  defaultBackupDirectory?: boolean;
  backupDirectory?: string;
};

export type BackupStore = ReturnType<typeof useBackupStore>;

export const BACKUP_STORE = "backupStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBackupStore = (defaultDetails: Details) => {
  const store = observable({
    details: defaultDetails,
    setInfo(value: BackupInfo): void {
      store.details.backupInfoLoaded = true;
      store.details.defaultPassword = value.wallets.defaultPassword;
      store.details.mnemonicShown = value.wallets.mnemonicShown;
      store.details.defaultBackupDirectory = value.backup.defaultLocation;
      store.details.backupDirectory = value.backup.location;
    },
    get backupInfoLoaded(): boolean {
      return store.details.backupInfoLoaded;
    },
    get backupDirectory(): string | undefined {
      return store.details.backupDirectory;
    },
    get defaultPassword(): boolean | undefined {
      return store.details.defaultPassword;
    },
    get mnemonicShown(): boolean | undefined {
      return store.details.mnemonicShown;
    },
    get defaultBackupDirectory(): boolean | undefined {
      return store.details.defaultBackupDirectory;
    },
    setDefaultPassword(value: boolean): void {
      store.details.defaultPassword = value;
    },
    setMnemonicShown(value: boolean): void {
      store.details.mnemonicShown = value;
    },
    setDefaultBackupDirectory(value: boolean): void {
      store.details.defaultBackupDirectory = value;
    },
    setBackupDirectory(value: string): void {
      store.details.backupDirectory = value;
    },
  });

  return store;
};
