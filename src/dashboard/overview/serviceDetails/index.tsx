import {
  DialogTitle,
  Divider,
  Grid
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { ReactElement } from "react";
import { Status } from "../../../models/Status";
import ServiceDetailsContent from "../serviceDetailsContent";

//styles
import {
  Dialog
} from "./styles";

export type ServiceDetailsProps = {
  status: Status;
  handleClose: () => void;
};

const ServiceDetails = (props: ServiceDetailsProps): ReactElement => {
  const { status, handleClose } = props;

  return (
    <Dialog
      open
      onClose={handleClose}
    >
      <DialogTitle>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item container xs lg>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
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
