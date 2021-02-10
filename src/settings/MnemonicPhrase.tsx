import {
  Checkbox,
  CircularProgress,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { Subject } from "rxjs";
import api from "../api";
import { getErrorMsg } from "../common/errorUtil";
import { BackupStore, BACKUP_STORE } from "../stores/backupStore";
import ActionButtons from "./ActionButtons";

type MnemonicPhraseProps = {
  onCompleteSubject: Subject<boolean>;
  backupStore?: BackupStore;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mnemonicList: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: theme.spacing(8),
    },
    mnemonicItem: {
      margin: theme.spacing(1),
      flexBasis: "21%",
    },
  })
);

const MnemonicPhrase = inject(BACKUP_STORE)(
  observer(
    (props: MnemonicPhraseProps): ReactElement => {
      const { onCompleteSubject, backupStore } = props;
      const classes = useStyles();
      const [error, setError] = useState("");
      const [checked, setChecked] = useState(false);
      const [mnemonic, setMnemonic] = useState<string[]>([]);

      useEffect(() => {
        api.getMnemonic$().subscribe({
          next: (resp) => {
            backupStore!.setMnemonicShown(true);
            setMnemonic(resp.seed_mnemonic);
          },
          error: (err) => setError(getErrorMsg(err)),
        });
      }, [backupStore]);

      return (
        <>
          {error ? (
            <Grid item container justify="center" alignItems="center">
              <Typography variant="body1" color="error" align="center">
                Failed to fetch the mnemonic phrase
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                {error}
              </Typography>
            </Grid>
          ) : mnemonic.length ? (
            <>
              <ol className={classes.mnemonicList}>
                {mnemonic.map((word, i) => (
                  <li key={i} className={classes.mnemonicItem}>
                    {word}
                  </li>
                ))}
              </ol>
              <Grid item container justify="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() =>
                        setChecked((previousChecked) => !previousChecked)
                      }
                      name="checked"
                      color="default"
                    />
                  }
                  label="I understand that I will not be able to recover my funds if I lose this data"
                />
              </Grid>

              <ActionButtons
                primaryButtonOnClick={() => onCompleteSubject.next(true)}
                primaryButtonText="Next"
                primaryButtonDisabled={!checked}
                hideSecondaryButton
              />
            </>
          ) : (
            <>
              <Grid item container justify="center" alignItems="center">
                <CircularProgress color="inherit" />
              </Grid>
              <Grid item container />
            </>
          )}
        </>
      );
    }
  )
);

export default MnemonicPhrase;
