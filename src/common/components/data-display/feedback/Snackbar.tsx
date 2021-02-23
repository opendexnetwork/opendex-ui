import {
  makeStyles,
  Snackbar as MaterialSnackbar,
  SnackbarContent,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { ReactElement, useEffect, useState } from "react";
import { Subject } from "rxjs";
import IconButton from "../../input/buttons/IconButton";

type SnackbarProps = {
  message: string;
  openSubject: Subject<boolean>;
  type: "error" | "success" | "warning" | "info";
};

const useStyles = makeStyles((theme) => ({
  snackbar: {
    bottom: theme.spacing(3) * 2,
    right: theme.spacing(3) * 2,
  },
  snackbarContent: (props: SnackbarProps) => ({
    backgroundColor: theme.palette[props.type].main,
    color: theme.palette[props.type].contrastText,
  }),
}));

const Snackbar = (props: SnackbarProps): ReactElement => {
  const { message, openSubject } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles(props);

  useEffect(() => {
    const sub = openSubject.subscribe(setOpen);
    return () => sub.unsubscribe();
  }, [openSubject]);

  return (
    <MaterialSnackbar
      className={classes.snackbar}
      open={open}
      autoHideDuration={10000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <SnackbarContent
        className={classes.snackbarContent}
        message={message}
        action={
          <IconButton
            icon={<CloseIcon />}
            tooltipTitle="Close"
            onClick={() => setOpen(false)}
          />
        }
      />
    </MaterialSnackbar>
  );
};

export default Snackbar;
