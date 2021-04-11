import { makeStyles, Theme } from "@material-ui/core";
import React, { ReactElement } from "react";
import { drawerWidth } from "../../common/components/navigation/Menu";
import { Status } from "../../models/Status";
import ServiceDetailsContent from "./ServiceDetailsContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { collapseIcon } from "../../common/utils/svgIcons";
import ButtonBase from "@material-ui/core/ButtonBase";

export type ServiceDetailsProps = {
  status: Status;
  statusIcon: string;
  handleClose: () => void;
  titleBackground: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    position: "absolute",
    left: drawerWidth,
    top: 80,
    margin: theme.spacing(3),
    width: "100%",
    maxWidth: `calc(100% - ${drawerWidth + theme.spacing(3) * 2}px)`,
    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
  },
  dialogTitle: {
    fontSize: "18px",
    color: "#000000",
  },
  dialogTitleContainer: (props: ServiceDetailsProps) => ({
    backgroundImage: props.titleBackground,
    padding: "8px",
  }),
  dialogTitleContent: {
    display: "flex",
    alignItems: "center",
    padding: "5px 15px",
  },
  logsAndCloseContainer: {
    display: "flex",
    marginLeft: "auto",
    alignItems: "center",
  },
  dialogContent: {
    padding: 0,
  },
}));

const ServiceDetails = (props: ServiceDetailsProps): ReactElement => {
  const { status, handleClose, statusIcon } = props;
  const classes = useStyles(props);

  return (
    <div>
      <Dialog
        open
        onClose={handleClose}
        classes={{
          paper: classes.dialog,
        }}
      >
        <DialogTitle className={classes.dialogTitleContainer}>
          <div className={classes.dialogTitleContent}>
            <span
              className={classes.dialogTitle}
            >{`General ${status.service} info`}</span>

            <div className={classes.logsAndCloseContainer}>
              <ButtonBase onClick={handleClose}>
                <img src={collapseIcon} alt="collapse" />
              </ButtonBase>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <ServiceDetailsContent
            status={status}
            closeDetails={handleClose}
            statusIcon={statusIcon}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetails;
