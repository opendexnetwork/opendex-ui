import {
  Button,
  Divider,
  Icon,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import React, { ReactElement, useState } from "react";
import api from "../../../api";
import { formatDateTimeForFilename } from "../../../common/dateUtil";
import { isServiceReady } from "../../../common/serviceUtil";
import { SERVICES_WITH_ADDITIONAL_INFO } from "../../../constants";
import { Status } from "../../../models/Status";
import ServiceDetails from "../serviceDetails";

//styles
import {
  StyledGrid,
  CardContent,
  CardCellGrid,
  StatusDot,
  Snackbar,
  SnackbarContent
} from "./styles";

export type OverviewItemProps = {
  status: Status;
  xudLocked?: boolean;
  xudNotReady?: boolean;
};

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
  const { status, xudLocked, xudNotReady } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [errorMsgOpen, setErrorMsgOpen] = useState(false);

  const isDetailsIconVisible = (status: Status): boolean => {
    return (
      !xudLocked &&
      !xudNotReady &&
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
        <StyledGrid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid container item>
            {isDetailsIconVisible(status) && (
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
            <StatusDot isServiceReady={isServiceReady(status)} />
            <Typography component="span" variant="body1" noWrap>
              {props.status.service}
            </Typography>
          </Grid>
          <Grid container item justify="flex-end">
            {isDownloadLogsEnabled(status) && (
              <Tooltip title="Download logs">
                <Button
                  size="small"
                  startIcon={<GetAppOutlinedIcon fontSize="small" />}
                  onClick={() =>
                    downloadLogs(status.service, () => setErrorMsgOpen(true))
                  }
                >
                  Logs
                </Button>
              </Tooltip>
            )}
          </Grid>
        </StyledGrid>
        <Divider />
        <CardContent>
          <Grid container item>
            <CardCellGrid item xs={4}>
              Status
            </CardCellGrid>
            <Divider orientation="vertical" flexItem />
            <CardCellGrid item xs={7}>
              {props.status.status}
            </CardCellGrid>
          </Grid>
        </CardContent>
      </Card>

      {detailsOpen && (
        <ServiceDetails
          status={status}
          handleClose={() => setDetailsOpen(false)}
        />
      )}

      <Snackbar
        open={errorMsgOpen}
        autoHideDuration={10000}
        onClose={() => setErrorMsgOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <SnackbarContent
          message={`Could not download the logs for ${status.service}`}
          action={
            <IconButton onClick={() => setErrorMsgOpen(false)}>
              <CloseIcon />
            </IconButton>
          }
        />
      </Snackbar>
    </Grid>
  );
};

export default OverviewItem;
