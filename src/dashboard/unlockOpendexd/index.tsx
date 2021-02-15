import {
  Grid,
  Typography
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";
import ButtonWithLoading from "../../common/buttonWithLoading";
import Password from "../../common/Password";
import api from "../../api";
import { getErrorMsg, OPENDEXD_ERROR_MESSAGES } from "../../common/errorUtil";

//styles
import {
  Container,
  ErrorMessageContainer
} from "./styles";

const UnlockOpendexd = (): ReactElement => {
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
      <Container container justify="space-around">
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
          <ErrorMessageContainer
            item
            container
            direction="column"
            alignItems="center"
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
          </ErrorMessageContainer>
        </Grid>
      </Container>
    </form>
  );
};

export default UnlockOpendexd;
