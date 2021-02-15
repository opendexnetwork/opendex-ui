import { Button, Grid, Tooltip } from "@material-ui/core";
import React, { ReactElement } from "react";

type WalletTransactionButtonProps = {
  text: string;
  disabledHint: string;
  onClick: () => void;
};

const WalletTransactionButton = (
  props: WalletTransactionButtonProps
): ReactElement => {
  const { text, disabledHint, onClick } = props;

  return (
    <Grid item>
      <Tooltip title={disabledHint}>
        <span>
          <Button
            disabled={!!disabledHint}
            variant="contained"
            color="primary"
            disableElevation
            onClick={onClick}
          >
            {text}
          </Button>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default WalletTransactionButton;
