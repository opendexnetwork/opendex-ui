import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { ReactElement } from "react";
import Dialog from "../../common/components/layout/dialog/Dialog";
import { drawerWidth } from "../../common/components/navigation/Menu";
import { Status } from "../../models/Status";
import ServiceDetailsContent from "./ServiceDetailsContent";

export type ServiceDetailsProps = {
  status: Status;
  handleClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      position: "absolute",
      left: drawerWidth,
      top: 0,
      margin: theme.spacing(3),
      width: "100%",
      maxWidth: `calc(100% - ${drawerWidth + theme.spacing(3) * 2}px)`,
      backgroundColor: theme.palette.background.default,
    },
  })
);

const ServiceDetails = (props: ServiceDetailsProps): ReactElement => {
  const { status, handleClose } = props;
  const classes = useStyles();

  const title = `General ${status.service} info`;

  return (
    <Dialog
      open
      handleClose={handleClose}
      classes={{
        paper: classes.dialog,
      }}
      headerVisible
      closeIconVisible
      title={title}
      content={
        <ServiceDetailsContent status={status} closeDetails={handleClose} />
      }
    />
  );
};

export default ServiceDetails;
