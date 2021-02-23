import { createStyles, Grid, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";
import Button from "../common/components/input/buttons/Button";
import ButtonWithLoading from "../common/components/input/buttons/ButtonWithLoading";

type ActionButtonsProps = {
  primaryButtonOnClick: () => void;
  secondaryButtonOnClick?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLoading?: boolean;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  hideSecondaryButton?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      alignSelf: "flex-end",
    },
  })
);

const ActionButtons = (props: ActionButtonsProps): ReactElement => {
  const {
    primaryButtonOnClick,
    secondaryButtonOnClick,
    primaryButtonText,
    secondaryButtonText,
    primaryButtonLoading,
    primaryButtonDisabled,
    secondaryButtonDisabled,
    hideSecondaryButton,
  } = props;
  const classes = useStyles();

  return (
    <Grid
      item
      container
      justify="flex-end"
      spacing={2}
      className={classes.wrapper}
    >
      {!hideSecondaryButton && (
        <Grid item>
          <Button
            text={secondaryButtonText || "Cancel"}
            variant="outlined"
            disabled={secondaryButtonDisabled}
            onClick={secondaryButtonOnClick}
          />
        </Grid>
      )}
      <Grid item>
        <ButtonWithLoading
          text={primaryButtonText || "Save"}
          disabled={primaryButtonDisabled}
          loading={primaryButtonLoading}
          onClick={primaryButtonOnClick}
        />
      </Grid>
    </Grid>
  );
};

export default ActionButtons;
