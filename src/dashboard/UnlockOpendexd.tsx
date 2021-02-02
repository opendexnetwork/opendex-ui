import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";
import ButtonWithLoading from "../common/ButtonWithLoading";
import api from "../api";
import { getErrorMsg, OPENDEXD_ERROR_MESSAGES } from "../common/errorUtil";
import Password from "../common/Password";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "50vh",
      maxHeight: 500,
    },
    errorMessageContainer: {
      minHeight: 50,
      marginTop: theme.spacing(2),
    },
  })
);

const UnlockOpendexd = (): ReactElement => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [queryInProgress, setQueryInProgress] = useState(false);

  const unlock = () => {
    setQueryInProgress(true);
    setError("");
    api.unlock$(password).subscribe({
      next: () => {},
      error: (err) => {
        const errorMessage = getErrorMsg(err);
        setError(OPENDEXD_ERROR_MESSAGES[errorMessage] || errorMessage);
        setQueryInProgress(false);
      },
    });
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          unlock();
          return false;
        }
      }}
    >
      <Grid container justify="space-around" className={classes.container}>
        <Grid item container justify="center" alignItems="center">
          <Password
            value={password}
            onChange={(event) => {
              setError("");
              setPassword(event.target.value);
            }}
          />
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item container justify="center">
            <ButtonWithLoading
              text="Unlock"
              disabled={queryInProgress || !password}
              loading={queryInProgress}
              onClick={unlock}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            className={classes.errorMessageContainer}
          >
            {!!error && (
              <>
                <Typography variant="body1" color="error" align="center">
                  Failed to unlock
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  {error}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default UnlockOpendexd;
