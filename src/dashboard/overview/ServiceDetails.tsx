import {
  createStyles,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { ReactElement } from "react";
import IconButton from "../../common/components/input/buttons/IconButton";
import { Status } from "../../models/Status";
import { drawerWidth } from "../Dashboard";
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

  return (
    <Dialog
      open
      onClose={handleClose}
      classes={{
        paper: classes.dialog,
      }}
    >
      <DialogTitle>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item container xs lg>
            <IconButton
              onClick={handleClose}
              icon={<CloseIcon />}
              tooltipTitle="Close"
            />
          </Grid>
          <Grid item container justify="center" xs={10} lg={11}>
            <Typography variant="h4" component="h4">
              General {status.service} info
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <Divider />
      <ServiceDetailsContent status={status} closeDetails={handleClose} />
    </Dialog>
  );
};

export default ServiceDetails;
