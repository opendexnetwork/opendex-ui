import { makeStyles, Theme } from "@material-ui/core";
import React, { ReactElement } from "react";
import { Subject } from "rxjs";
import { drawerWidth } from "../../common/components/navigation/Menu";
import { Status } from "../../models/Status";
import ServiceDetailsContent from "./ServiceDetailsContent";
import { formatDateTimeForFilename } from "../../common/utils/dateUtil";
import api from "../../api";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { downloadIcon, expandIcon } from "../../common/utils/svgIcons";
import ButtonBase from "@material-ui/core/ButtonBase";
import Snackbar from "../../common/components/data-display/feedback/Snackbar";

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
  downloadIconContainer: {
    paddingRight: "30px",
    fontSize: "14px",
    color: "#000000",
    textDecoration: "underline",
  },
  dialogTitleContainer: (props: ServiceDetailsProps) => ({
    backgroundImage: props.titleBackground,
    padding: "8px",
  }),
  dialogTitleContent: {
    display: "flex",
    alignItems: "baseline",
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
  const errorMsgOpenSubject = new Subject<boolean>();

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
              <ButtonBase onClick={handleClose}>
                <img src={expandIcon} alt="expand" />
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

      <Snackbar
        message={`Could not download the logs for ${status.service}`}
        openSubject={errorMsgOpenSubject}
        type="error"
      ></Snackbar>
    </div>
  );
};

export default ServiceDetails;
