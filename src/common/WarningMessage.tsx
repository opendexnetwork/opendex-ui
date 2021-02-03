import {
  Card,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import React, { ReactElement } from "react";
import CloseIcon from "@material-ui/icons/Close";

type WarningMessageProps = {
  message: string;
  showCloseIcon?: boolean;
  onClose?: () => void;
  alignToStart?: boolean;
  additionalButtons?: { button: ReactElement; key: string }[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    warningMessage: {
      backgroundColor: theme.palette.warning.dark,
      color: theme.palette.warning.contrastText,
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
    },
    iconContainer: {
      display: "flex",
    },
  })
);

const WarningMessage = (props: WarningMessageProps): ReactElement => {
  const {
    message,
    showCloseIcon,
    onClose,
    alignToStart,
    additionalButtons,
  } = props;
  const classes = useStyles();

  return (
    <Grid item>
      <Card elevation={0} className={classes.warningMessage}>
        <Grid
          item
          container
          wrap="nowrap"
          justify="space-between"
          alignItems="center"
        >
          <Grid
            item
            container
            spacing={1}
            justify={alignToStart ? "flex-start" : "center"}
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item className={classes.iconContainer}>
              <WarningIcon fontSize="small" />
            </Grid>
            <Grid item>
              <Typography variant="body2" align="center">
                {message}
              </Typography>
            </Grid>
          </Grid>
          {(showCloseIcon || additionalButtons?.length) && (
            <Grid item container justify="flex-end" spacing={1}>
              {additionalButtons?.map((button) => (
                <Grid item key={button.key}>
                  {button.button}
                </Grid>
              ))}
              {showCloseIcon && (
                <Grid item>
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => (onClose ? onClose() : void 0)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Card>
    </Grid>
  );
};

export default WarningMessage;
