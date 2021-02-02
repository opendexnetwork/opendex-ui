import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useState } from "react";
import { Subject } from "rxjs";
import api from "../api";
import ErrorMessage from "../common/ErrorMessage";
import { getErrorMsg } from "../common/errorUtil";
import Password from "../common/Password";
import SuccessMessage from "../common/SuccessMessage";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";
import ActionButtons from "./ActionButtons";

type ChangePasswordProps = {
  isSetup?: boolean;
  passwordUpdatedSubject?: Subject<boolean>;
  backupStore?: BackupStore;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: "100%",
      width: "100%",
    },
    inputContainer: {
      marginTop: theme.spacing(2),
    },
    messageContainer: {
      minHeight: 50,
    },
  })
);

const ChangePassword = inject(BACKUP_STORE)(
  observer(
    (props: ChangePasswordProps): ReactElement => {
      const classes = useStyles();
      const { isSetup, passwordUpdatedSubject, backupStore } = props;
      const [currentPassword, setCurrentPassword] = useState(
        isSetup ? "OpenDEX!Rocks" : ""
      );
      const [newPassword, setNewPassword] = useState("");
      const [confirmNewPassword, setConfirmNewPassword] = useState("");
      const [error, setError] = useState("");
      const [queryInProgress, setQueryInProgress] = useState(false);
      const [success, setSuccess] = useState(false);

      const updatePassword = (): void => {
        if (newPassword !== confirmNewPassword) {
          setError("Passwords do not match");
          return;
        }
        setError("");
        setSuccess(false);
        setQueryInProgress(true);
        api.changePassword$(newPassword, currentPassword).subscribe({
          next: () => {
            setSuccess(true);
            backupStore!.setDefaultPassword(false);
            passwordUpdatedSubject?.next(true);
          },
          error: (err) => {
            setQueryInProgress(false);
            setError(getErrorMsg(err));
            passwordUpdatedSubject?.next(false);
          },
          complete: () => setQueryInProgress(false),
        });
      };

      return (
        <>
          <Grid item container justify="center" direction="column">
            {!isSetup && (
              <Grid
                item
                container
                justify="center"
                className={classes.inputContainer}
              >
                <Password
                  label="Current Password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setError("");
                  }}
                />
              </Grid>
            )}
            <Grid
              item
              container
              justify="center"
              className={classes.inputContainer}
            >
              <Password
                label={isSetup ? "Password" : "New Password"}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setError("");
                }}
              />
            </Grid>
            <Grid
              item
              container
              justify="center"
              className={classes.inputContainer}
            >
              <Password
                label={isSetup ? "Confirm Password" : "Confirm New Password"}
                value={confirmNewPassword}
                onChange={(event) => {
                  setConfirmNewPassword(event.target.value);
                  setError("");
                }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            className={classes.messageContainer}
          >
            {!!error && (
              <ErrorMessage
                mainMessage={`Failed to ${
                  isSetup ? "create" : "change"
                } password`}
                details={error}
              />
            )}
            {success && !isSetup && (
              <SuccessMessage message="Password updated" />
            )}
          </Grid>
          <ActionButtons
            primaryButtonOnClick={updatePassword}
            primaryButtonText={isSetup ? "Next" : undefined}
            primaryButtonDisabled={
              queryInProgress ||
              !currentPassword ||
              !newPassword ||
              !confirmNewPassword
            }
            primaryButtonLoading={queryInProgress}
            secondaryButtonOnClick={() => {
              setCurrentPassword((oldValue) => (isSetup ? oldValue : ""));
              setNewPassword("");
              setConfirmNewPassword("");
            }}
            secondaryButtonDisabled={queryInProgress}
          />
        </>
      );
    }
  )
);

export default ChangePassword;
