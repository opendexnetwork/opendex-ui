import { Collapse, createStyles, makeStyles, Theme } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { catchError, exhaustMap, filter, retry, take } from "rxjs/operators";
import api from "../api";
import WarningMessage from "../common/components/data-display/WarningMessage";
import Button from "../common/components/input/buttons/Button";
import { Path } from "../router/Path";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";
import { logError } from "../common/utils/appUtil";
import { getErrorMsg } from "../common/utils/errorUtil";

type SetupWarningProps = {
  backupStore?: BackupStore;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: "100%",
    },
    wrapperMargin: {
      marginBottom: theme.spacing(1),
    },
  })
);

const SetupWarning = inject(BACKUP_STORE)(
  observer(
    (props: SetupWarningProps): ReactElement => {
      const { backupStore } = props;
      const classes = useStyles();
      const history = useHistory();
      const [visible, setVisible] = useState(false);
      const [closed, setClosed] = useState(false);
      const [closeBtnVisible, setCloseBtnVisible] = useState(false);

      useEffect(() => {
        const sub = api
          .getBackupInfo$()
          .pipe(retry(3))
          .subscribe({
            next: (resp) => backupStore!.setInfo(resp),
            error: (err) =>
              logError(`Failed to retrieve backup info: ${getErrorMsg(err)}`),
          });
        return () => sub.unsubscribe();
      }, [backupStore]);

      useEffect(() => {
        const sub = interval(1000).subscribe(() =>
          setVisible(
            !closed &&
              backupStore!.backupInfoLoaded &&
              (!!backupStore!.defaultPassword ||
                !backupStore!.mnemonicShown ||
                !!backupStore!.defaultBackupDirectory)
          )
        );
        return () => sub.unsubscribe();
      }, [backupStore, closed]);

      useEffect(() => {
        const balanceSubscription = interval(15000)
          .pipe(
            filter(() => visible),
            exhaustMap(() => api.getbalance$()),
            catchError((_e, caught) => caught),
            filter((value) => !!Object.keys(value.balances)?.length),
            take(1),
            filter(
              (value) =>
                !Object.values(value.balances).some(
                  (balance) => Number(balance.total_balance) > 0
                )
            )
          )
          .subscribe({
            next: () => setCloseBtnVisible(true),
          });
        return () => balanceSubscription.unsubscribe();
      }, [visible]);

      return (
        <Collapse
          in={visible}
          className={
            visible
              ? `${classes.wrapper} ${classes.wrapperMargin}`
              : classes.wrapper
          }
        >
          <WarningMessage
            message="Secure your funds. Setup password, store mnemonic, and save backup data."
            alignToStart
            showCloseIcon={closeBtnVisible}
            onClose={() => {
              setClosed(true);
              setVisible(false);
            }}
            additionalButtons={[
              {
                button: (
                  <Button
                    text="Setup Now"
                    size="small"
                    color="inherit"
                    variant="outlined"
                    onClick={() =>
                      history.push(
                        `${Path.DASHBOARD}${Path.SETTINGS}${Path.INITIAL_SETUP}`
                      )
                    }
                  />
                ),
                key: "CloseWarningBtn",
              },
            ]}
          />
        </Collapse>
      );
    }
  )
);

export default SetupWarning;
