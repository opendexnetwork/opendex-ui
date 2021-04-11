import { Icon, makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { ReactElement, useState } from "react";
import { isServiceReady } from "../../common/utils/serviceUtil";
import { SERVICES_WITH_ADDITIONAL_INFO } from "../../constants";
import { Status } from "../../models/Status";
import ServiceDetails from "./ServiceDetails";
import {
  expandIcon,
  readyIcon,
  syncingIcon,
  downloadIcon,
} from "../../common/utils/svgIcons";
import ButtonBase from "@material-ui/core/ButtonBase";
import api from "../../api";
import { formatDateTimeForFilename } from "../../common/utils/dateUtil";
import { Subject } from "rxjs";
import Snackbar from "../../common/components/data-display/feedback/Snackbar";

export type OverviewItemProps = {
  status: Status;
  opendexdLocked?: boolean;
  opendexdNotReady?: boolean;
};

const getCardHeaderBackgroundImage = (props: OverviewItemProps) => {
  if (isServiceReady(props.status)) {
    return "linear-gradient(to right, #1f995a, #00e64d)";
  } else {
    return "linear-gradient(to left, #fea900, #f15a24 0%)";
  }
};

const useStyles = makeStyles(() => ({
  cardHeader: (props: OverviewItemProps) => ({
    padding: "12px 16px 12px 24px",
    backgroundImage: getCardHeaderBackgroundImage(props),
    justifyContent: "space-between",
    alignItems: "center",
  }),
  cardHeading: {
    fontSize: "20px",
    color: "#000000",
  },
  cardContainer: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  cardContent: {
    fontSize: "16px",
    display: "flex",
    padding: "35px 25px",
  },
  cardContentStatusText: {
    color: "#979797",
  },
  cardContentStatusValueText: {
    color: "#f2f2f2",
  },
  expandIcon: {
    cursor: "pointer",
  },
  expandIconContainer: {
    verticalAlign: "middle",
  },
  statusIcon: {
    padding: "0 10px",
  },
  downloadIconContainer: {
    fontSize: "14px",
    color: "#000000",
    textDecoration: "underline",
  },
  detailsIconContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  titleAndLogsContainer: {
    width: "66.6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const OverviewItem = (props: OverviewItemProps): ReactElement => {
  const { status, opendexdLocked, opendexdNotReady } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const classes = useStyles(props);
  const errorMsgOpenSubject = new Subject<boolean>();

  const isDetailsIconVisible = (status: Status): boolean => {
    return (
      !opendexdLocked &&
      !opendexdNotReady &&
      SERVICES_WITH_ADDITIONAL_INFO.includes(status.service) &&
      isServiceReady(status)
    );
  };

  const getStatusIcon = (status: Status) => {
    if (isServiceReady(status)) {
      return readyIcon;
    } else {
      return syncingIcon;
    }
  };

  const isDownloadLogsEnabled = (status: Status): boolean => {
    return (
      !status.status.includes("light mode") && status.status !== "Disabled"
    );
  };

  const downloadLogs = (serviceName: string, handleError: () => void): void => {
    api.logs$(serviceName).subscribe({
      next: (resp: string) => {
        const blob = new Blob([resp]);
        const url = URL.createObjectURL(blob);
        const anchor = Object.assign(document.createElement("a"), {
          href: url,
          download: `${serviceName}_${formatDateTimeForFilename(
            new Date()
          )}.log`,
          style: { display: "none" },
        });
        anchor.click();
      },
      error: handleError,
    });
  };

  return (
    <div>
      <Card square={true}>
        <Grid container className={classes.cardHeader}>
          <div className={classes.titleAndLogsContainer}>
            <Grid>
              <Typography
                component="span"
                variant="body1"
                className={classes.cardHeading}
              >
                {props.status.service}
              </Typography>
            </Grid>

            <Grid>
              {isDownloadLogsEnabled(status) && (
                <div>
                  <ButtonBase
                    className={classes.downloadIconContainer}
                    onClick={() =>
                      downloadLogs(status.service, () =>
                        errorMsgOpenSubject?.next(true)
                      )
                    }
                  >
                    <img src={downloadIcon} alt="download logs" />
                    Download Logs
                  </ButtonBase>
                </div>
              )}
            </Grid>
          </div>

          <Grid className={classes.detailsIconContainer}>
            {isDetailsIconVisible(status) && (
              <Icon
                onClick={() => setDetailsOpen(true)}
                className={classes.expandIconContainer}
              >
                <img
                  src={expandIcon}
                  alt="expand"
                  className={classes.expandIcon}
                />
              </Icon>
            )}
          </Grid>
        </Grid>

        <CardContent className={classes.cardContainer}>
          <div className={classes.cardContent}>
            <p className={classes.cardContentStatusText}>Status:</p>
            <img
              src={getStatusIcon(props.status)}
              alt="status"
              className={classes.statusIcon}
            />
            <p className={classes.cardContentStatusValueText}>
              {props.status.status}
            </p>
          </div>
        </CardContent>
      </Card>
      {detailsOpen && (
        <ServiceDetails
          status={status}
          statusIcon={getStatusIcon(props.status)}
          handleClose={() => setDetailsOpen(false)}
          titleBackground={getCardHeaderBackgroundImage(props)}
        />
      )}

      <Snackbar
        message={`Could not download the logs for ${status.service}`}
        openSubject={errorMsgOpenSubject}
        type="error"
      ></Snackbar>
    </div>
  );
};

export default OverviewItem;
