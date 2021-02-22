import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import React, { ReactElement } from "react";
import Button from "../../../common/components/input/buttons/Button";
import { darkTheme } from "../../../themes";

type PriceWarningProps = {
  priceOffset: number;
  containerId: string;
  handleClose: () => void;
  onConfirmed: () => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    iconContainer: {
      display: "flex",
    },
  })
);

const PriceWarning = (props: PriceWarningProps): ReactElement => {
  const { priceOffset, containerId, handleClose, onConfirmed } = props;
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open
        onClose={handleClose}
        style={{ position: "absolute" }}
        BackdropProps={{ style: { position: "absolute" } }}
        container={() => document.getElementById(containerId)}
      >
        <DialogContent>
          <Grid
            item
            container
            spacing={1}
            justify="center"
            alignItems="flex-start"
            wrap="nowrap"
          >
            <Grid item className={classes.iconContainer}>
              <WarningIcon fontSize="small" />
            </Grid>
            <Grid item>
              <Typography variant="body2" align="center">
                Once executed, this order will move the market price by{" "}
                {priceOffset}%.
              </Typography>
              <Typography variant="body2" align="center">
                Are you sure you want to go ahead?
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button text="Cancel" variant="outlined" onClick={handleClose} />
          <Button
            text="Place Order"
            variant="contained"
            color="primary"
            onClick={onConfirmed}
          />
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default PriceWarning;
