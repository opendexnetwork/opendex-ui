import { Icon, makeStyles, Theme } from "@material-ui/core";
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
} from "../../common/utils/svgIcons";

export type OverviewItemProps = {
  status: Status;
  opendexdLocked?: boolean;
  opendexdNotReady?: boolean;
};

const getCardHeaderBackgroundImage = (props: OverviewItemProps) => {
  if (props.status.status.includes("Ready")) {
    return "linear-gradient(to right, #1f995a, #00e64d)";
  } else {
    return "linear-gradient(to left, #fea900, #f15a24 0%)";
  }
};

const useStyles = makeStyles((theme: Theme) => ({
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
  expandIcon: {
    cursor: "pointer",
  },
  expandIconContainer: {
    verticalAlign: "middle",
  },
  statusIcon: {
    padding: "0 10px",
  },
}));

const OverviewItem = (props: OverviewItemProps): ReactElement => {
  const { status, opendexdLocked, opendexdNotReady } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const classes = useStyles(props);

  const isDetailsIconVisible = (status: Status): boolean => {
    return (
      !opendexdLocked &&
      !opendexdNotReady &&
      SERVICES_WITH_ADDITIONAL_INFO.includes(status.service) &&
      isServiceReady(status)
    );
  };

  const getStatusIcon = (status: Status) => {
    if (status.status.includes("Ready")) {
      return readyIcon;
    } else {
      return syncingIcon;
    }
  };

  return (
    <div>
      <Card square={true}>
        <Grid container className={classes.cardHeader}>
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
    </div>
  );
};

export default OverviewItem;
