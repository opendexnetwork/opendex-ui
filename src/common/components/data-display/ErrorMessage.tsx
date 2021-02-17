import { Grid, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

type ErrorDetail = {
  detail: string;
  key: string;
};

type ErrorMessageProps = {
  mainMessage?: string;
  details: string | ErrorDetail[];
};

const ErrorMessage = (props: ErrorMessageProps): ReactElement => {
  const { details, mainMessage } = props;

  const errorDetail = (detail: string, key?: string) => (
    <Typography variant="body2" color="textSecondary" align="center" key={key}>
      {detail}
    </Typography>
  );

  return (
    <Grid
      item
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Typography variant="body1" color="error" align="center">
        {mainMessage || "Failed to fetch data"}
      </Typography>
      {typeof details === "string"
        ? errorDetail(details)
        : details
            .filter((d) => !!d.detail)
            .map((d) => errorDetail(d.detail, d.key))}
    </Grid>
  );
};

export default ErrorMessage;
