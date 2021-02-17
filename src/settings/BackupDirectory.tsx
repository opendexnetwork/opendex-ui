import {
  Button,
  createStyles,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import CancelIcon from "@material-ui/icons/Cancel";
import React, { ReactElement, useEffect, useState } from "react";
import { Subject } from "rxjs";
import { isElectron, sendMessageToParent } from "../common/utils/appUtil";
import ErrorMessage from "../common/components/data-display/ErrorMessage";
import SuccessMessage from "../common/components/data-display/SuccessMessage";
import { ElectronStore, ELECTRON_STORE } from "../stores/electronStore";
import ActionButtons from "./ActionButtons";
import { ConnectionType } from "../enums";
import api from "../api";
import { getErrorMsg } from "../common/utils/errorUtil";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";

type BackupDirectoryProps = {
  onCompleteSubject?: Subject<boolean>;
  electronStore?: ElectronStore;
  backupStore?: BackupStore;
};

const useStyles = makeStyles(() =>
  createStyles({
    inputContainer: {
      width: "100%",
      maxWidth: 500,
    },
    messageContainer: {
      minHeight: 50,
    },
  })
);

const BackupDirectory = inject(
  ELECTRON_STORE,
  BACKUP_STORE
)(
  observer(
    (props: BackupDirectoryProps): ReactElement => {
      const classes = useStyles();
      const { onCompleteSubject, electronStore, backupStore } = props;
      const [error, setError] = useState("");
      const [queryInProgress, setQueryInProgress] = useState(false);
      const [backupDirectory, setBackupDirectory] = useState("");
      const [success, setSuccess] = useState(false);

      const saveBackupDir = (): void => {
        setError("");
        setSuccess(false);
        setQueryInProgress(true);
        api.updateBackupDirectory$(backupDirectory).subscribe({
          next: () => {
            backupStore!.setBackupDirectory(backupDirectory);
            backupStore!.setDefaultBackupDirectory(false);
            setSuccess(true);
            setQueryInProgress(false);
            onCompleteSubject?.next(true);
          },
          error: (err) => {
            setError(getErrorMsg(err));
            setQueryInProgress(false);
          },
        });
      };

      useEffect(() => {
        setBackupDirectory(backupStore!.backupDirectory || "");
      }, [backupStore]);

      useEffect(() => {
        const messageListenerHandler = (event: MessageEvent) => {
          if (event.data.startsWith("chooseDirectory")) {
            setBackupDirectory(event.data.substr(event.data.indexOf(":") + 2));
          }
        };
        window.addEventListener("message", messageListenerHandler);
        return () =>
          window.removeEventListener("message", messageListenerHandler);
      }, []);

      const isLocalConnection =
        isElectron() && electronStore!.connectionType === ConnectionType.LOCAL;

      return (
        <>
          <Grid item container alignItems="center" justify="center">
            <Typography variant="body1" align="center">
              {isLocalConnection
                ? "Choose a backup directory to store files, which can be used alongside the mnemonic words to recover your opendexd node"
                : "To store backup files, enter a path from the device opendex-docker is running on. Backup files can then be used alongside mnemonic words to recover your opendexd node."}
            </Typography>
          </Grid>
          <Grid item container alignItems="center" justify="center">
            {isLocalConnection ? (
              !backupDirectory ? (
                <Button
                  disableElevation
                  color="secondary"
                  variant="outlined"
                  onClick={() => sendMessageToParent("chooseDirectory")}
                >
                  Choose
                </Button>
              ) : (
                <Grid
                  item
                  container
                  justify="center"
                  alignItems="center"
                  spacing={1}
                  wrap="nowrap"
                >
                  <Grid item>
                    <Typography>{backupDirectory}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => setBackupDirectory("")}>
                      <CancelIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )
            ) : (
              <FormControl
                variant="outlined"
                className={classes.inputContainer}
              >
                <OutlinedInput
                  id="backup-input"
                  value={backupDirectory || ""}
                  placeholder="/home/user/opendex-backup"
                  onChange={(event) => {
                    setBackupDirectory(event.target.value);
                  }}
                  endAdornment={
                    !!backupDirectory && (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setBackupDirectory("")}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                />
              </FormControl>
            )}
          </Grid>
          <Grid
            item
            container
            justify="center"
            className={classes.messageContainer}
          >
            {!!error && (
              <ErrorMessage
                mainMessage="Failed to set the backup directory"
                details={error}
              />
            )}
            {success && <SuccessMessage message="Backup directory updated" />}
          </Grid>
          <ActionButtons
            primaryButtonOnClick={saveBackupDir}
            primaryButtonDisabled={!backupDirectory || queryInProgress}
            primaryButtonLoading={queryInProgress}
            secondaryButtonOnClick={() =>
              setBackupDirectory(backupStore!.backupDirectory!)
            }
            secondaryButtonDisabled={queryInProgress}
            hideSecondaryButton={!backupStore!.backupDirectory}
          />
        </>
      );
    }
  )
);

export default BackupDirectory;
