import { Grid, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";
import { copyToClipboard } from "../../utils/appUtil";
import { copyIcon } from "../../../common/utils/svgIcons";
import ButtonBase from "@material-ui/core/ButtonBase";

type LabeledRowProps = {
  label: string;
  value: string | number;
  paddingSpacing?: number;
  showCopyIcon?: boolean;
  reserveSpaceForCopyIcon?: boolean;
  statusIcon?: string;
};

const useStyles = makeStyles((theme) => ({
  cell: (props: LabeledRowProps) => ({
    padding: theme.spacing(props.paddingSpacing ?? 2),
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
    fontSize: "16px",
  }),
  textLabel: {
    color: "#979797",
  },
  textValue: {
    color: "#f2f2f2",
  },
  copyIcon: {
    paddingRight: "5px",
  },
  copyContainer: {
    cursor: "pointer",
    color: "#f15a24",
    fontSize: "14px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  statusIcon: {
    marginRight: "10px",
  },
}));

const LabeledRow = (props: LabeledRowProps): ReactElement => {
  const { label, value, showCopyIcon, reserveSpaceForCopyIcon } = props;
  const classes = useStyles(props);

  return (
    <Grid container item alignItems="center">
      <Grid
        item
        xs={reserveSpaceForCopyIcon ? 2 : 3}
        className={`${classes.cell} ${classes.textLabel}`}
      >
        {label}
      </Grid>

      <Grid
        item
        xs={reserveSpaceForCopyIcon ? 6 : 7}
        className={`${classes.cell} ${classes.textValue}`}
      >
        {props.statusIcon ? (
          <div className={classes.statusContainer}>
            <img
              src={props.statusIcon}
              className={classes.statusIcon}
              alt="status"
            />
            {value}
          </div>
        ) : (
          <div>{value}</div>
        )}
      </Grid>
      {reserveSpaceForCopyIcon && (
        <Grid item xs={2} className={classes.cell}>
          {showCopyIcon && (
            <div className={classes.copyContainer}>
              <ButtonBase onClick={() => copyToClipboard(value)}>
                <img src={copyIcon} alt="copy" className={classes.copyIcon} />
                Copy
              </ButtonBase>
            </div>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default LabeledRow;
