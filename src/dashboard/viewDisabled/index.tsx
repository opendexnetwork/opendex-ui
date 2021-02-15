import {
  Grid,
  Typography
} from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement } from "react";
import UnlockXud from "../unlockXud";

//styles
import { Row } from "./styles";

export type ViewDisabledProps = {
  xudLocked?: boolean;
  xudStatus?: string;
};

function ViewDisabled(props: ViewDisabledProps): ReactElement {
  const { xudLocked, xudStatus } = props;
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Row
        container
        item
        alignItems="center"
        justify="center"
        spacing={2}
      >
        <Grid item>
          <Grid item container alignItems="center">
            <ReportProblemOutlinedIcon fontSize="large" />
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1">
            {xudLocked ? "XUD is locked" : "XUD is not ready"}
          </Typography>
        </Grid>
      </Row>
      <Row container item justify="center">
        {xudLocked ? (
          <UnlockXud />
        ) : (
          <Grid item>
            <Typography variant="h6" component="h2">
              {xudStatus || ""}
            </Typography>
          </Grid>
        )}
      </Row>
    </Grid>
  );
}

export default ViewDisabled;
