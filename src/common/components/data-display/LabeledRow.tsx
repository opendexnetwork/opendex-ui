import { Divider, Grid, IconButton, makeStyles } from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement } from "react";
import { copyToClipboard } from "../../utils/appUtil";

type LabeledRowProps = {
  label: string;
  value: string | number;
  paddingSpacing?: number;
  showCopyIcon?: boolean;
  reserveSpaceForCopyIcon?: boolean;
};

const useStyles = makeStyles((theme) => ({
  cell: (props: LabeledRowProps) => ({
    padding: theme.spacing(props.paddingSpacing ?? 2),
    textAlign: "center",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
  }),
}));

const LabeledRow = (props: LabeledRowProps): ReactElement => {
  const { label, value, showCopyIcon, reserveSpaceForCopyIcon } = props;
  const classes = useStyles(props);

  return (
    <Grid container item justify="space-between" alignItems="center">
      <Grid item xs={reserveSpaceForCopyIcon ? 3 : 4} className={classes.cell}>
        {label}
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={reserveSpaceForCopyIcon ? 6 : 7} className={classes.cell}>
        {value}
      </Grid>
      {reserveSpaceForCopyIcon && (
        <Grid item xs={2} className={classes.cell}>
          {showCopyIcon && (
            /* IconButton */
            <IconButton onClick={() => copyToClipboard(value)}>
              <FileCopyOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default LabeledRow;
