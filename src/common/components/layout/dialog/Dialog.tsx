import {
  Dialog as MaterialDialog,
  DialogProps as MaterialDialogProps,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { ReactElement } from "react";
import IconButton from "../../input/buttons/IconButton";

export type DialogProps = MaterialDialogProps & {
  content: ReactElement | ReactElement[];
  handleClose: () => void;
  headerVisible?: boolean;
  title?: string;
  closeIconVisible?: boolean;
};

const Dialog = (props: DialogProps): ReactElement => {
  const {
    content,
    handleClose,
    headerVisible,
    title,
    closeIconVisible,
    ...dialogProps
  } = props;

  const materialDialogProps: MaterialDialogProps = {
    onClose: handleClose,
    ...dialogProps,
  };

  return (
    <MaterialDialog {...materialDialogProps}>
      {headerVisible && (
        <>
          <DialogTitle>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
            >
              {closeIconVisible && (
                <Grid item container xs lg>
                  <IconButton
                    onClick={handleClose}
                    icon={<CloseIcon />}
                    tooltipTitle="Close"
                  />
                </Grid>
              )}
              <Grid item container justify="center" xs={10} lg={11}>
                <Typography variant="h4" component="h4">
                  {title}
                </Typography>
              </Grid>
            </Grid>
          </DialogTitle>
          <Divider />
        </>
      )}
      {content}
    </MaterialDialog>
  );
};

export default Dialog;
