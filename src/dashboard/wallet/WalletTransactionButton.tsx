import { Grid } from "@material-ui/core";
import React, { ReactElement } from "react";
import Button from "../../common/components/input/buttons/Button";

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
      <Button
        text={text}
        tooltipTitle={disabledHint}
        disabled={!!disabledHint}
        color="primary"
        onClick={onClick}
      />
    </Grid>
  );
};

export default WalletTransactionButton;
