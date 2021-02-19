import {
  Button,
  createStyles,
  Divider,
  Icon,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import React, { ReactElement, useState } from "react";
import { Subject } from "rxjs";
import api from "../../api";
import Snackbar from "../../common/components/data-display/feedback/Snackbar";
import LabeledRow from "../../common/components/data-display/LabeledRow";
import { formatDateTimeForFilename } from "../../common/utils/dateUtil";
import { isServiceReady } from "../../common/utils/serviceUtil";
import { SERVICES_WITH_ADDITIONAL_INFO } from "../../constants";
import { Status } from "../../models/Status";
import ServiceDetails from "./ServiceDetails";

export type OverviewItemProps = {
  status: Status;
  opendexdLocked?: boolean;
  opendexdNotReady?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardHeader: {
      padding: theme.spacing(3),
    },
    cardContent: {
      padding: 0,
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    statusDot: {
      height: 10,
      width: 10,
      borderRadius: "50%",
      display: "inline-block",
      marginRight: 10,
    },
    active: {
      backgroundColor: theme.palette.success.light,
    },
    inactive: {
      backgroundColor: theme.palette.error.light,
    },
  })
);

const downloadLogs = (serviceName: string, handleError: () => void): void => {
  api.logs$(serviceName).subscribe({
    next: (resp: string) => {
      const blob = new Blob([resp]);
      const url = URL.createObjectURL(blob);
      const anchor = Object.assign(document.createElement("a"), {
        href: url,
        download: `${serviceName}_${formatDateTimeForFilename(new Date())}.log`,
        style: { display: "none" },
      });
      anchor.click();
    },
    error: handleError,
  });
};

const OverviewItem = (props: OverviewItemProps): ReactElement => {
  const { status, opendexdLocked, opendexdNotReady } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const errorMsgOpenSubject = new Subject<boolean>();
  const classes = useStyles();

  const statusDotClass = `${classes.statusDot} ${
    isServiceReady(status) ? classes.active : classes.inactive
  }`;

  const isDetailsIconVisible = (status: Status): boolean => {
    return (
      !opendexdLocked &&
      !opendexdNotReady &&
      SERVICES_WITH_ADDITIONAL_INFO.includes(status.service) &&
      isServiceReady(status)
    );
  };

  const isDownloadLogsEnabled = (status: Status): boolean => {
    return (
      !status.status.includes("light mode") && status.status !== "Disabled"
    );
  };

  return (
    <Grid item xs={12} md={6} xl={4}>
      <Card>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          className={classes.cardHeader}
        >
          <Grid container item>
            {isDetailsIconVisible(status) && (
              /* IconButton */
              <Tooltip title="details">
                <IconButton size="small" onClick={() => setDetailsOpen(true)}>
                  <Icon fontSize="small">open_in_full</Icon>
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid
            container
            item
            alignItems="center"
            justify="center"
            wrap="nowrap"
          >
            <span className={statusDotClass}></span>
            <Typography component="span" variant="body1" noWrap>
              {props.status.service}
            </Typography>
          </Grid>
          <Grid container item justify="flex-end">
            {isDownloadLogsEnabled(status) && (
              /* TextButton */
              <Tooltip title="Download logs">
                <Button
                  size="small"
                  startIcon={<GetAppOutlinedIcon fontSize="small" />}
                  onClick={() =>
                    downloadLogs(status.service, () =>
                      errorMsgOpenSubject?.next(true)
                    )
                  }
                >
                  Logs
                </Button>
              </Tooltip>
            )}
          </Grid>
        </Grid>
        <Divider />
        <CardContent className={classes.cardContent}>
          <LabeledRow
            label="Status"
            value={props.status.status}
            paddingSpacing={4}
          />
        </CardContent>
      </Card>

      {detailsOpen && (
        <ServiceDetails
          status={status}
          handleClose={() => setDetailsOpen(false)}
        />
      )}

      <Snackbar
        message={`Could not download the logs for ${status.service}`}
        openSubject={errorMsgOpenSubject}
        type="error"
      ></Snackbar>
    </Grid>
  );
};

export default OverviewItem;
