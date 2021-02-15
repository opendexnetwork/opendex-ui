import {
  Grid,
  Typography
} from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement } from "react";
import UnlockOpendexd from "../unlockOpendexd";

//styles
import { Row } from "./styles";

export type ViewDisabledProps = {
  opendexdLocked?: boolean;
  opendexdStatus?: string;
};

function ViewDisabled(props: ViewDisabledProps): ReactElement {
  const { opendexdLocked, opendexdStatus } = props;
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
            {opendexdLocked ? "opendexd is locked" : "opendexd is not ready"}
          </Typography>
        </Grid>
      </Row>
      <Row container item justify="center">
        {opendexdLocked ? (
          <UnlockOpendexd />
        ) : (
          <Grid item>
            <Typography variant="h6" component="h2">
              {opendexdStatus || ""}
            </Typography>
          </Grid>
        )}
      </Row>
    </Grid>
  );
}

export default ViewDisabled;
