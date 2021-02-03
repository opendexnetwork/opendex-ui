export type BackupInfo = {
  wallets: WalletBackup;
  backup: BackupLocation;
};

type WalletBackup = {
  defaultPassword: boolean;
  mnemonicShown: boolean;
};

type BackupLocation = {
  location: string;
  defaultLocation: boolean;
};
