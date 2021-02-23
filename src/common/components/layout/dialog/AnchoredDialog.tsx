import React, { ReactElement } from "react";
import Dialog, { DialogProps } from "./Dialog";

type AnchoredDialogProps = DialogProps & {
  containerId: string;
};

const AnchoredDialog = (props: AnchoredDialogProps): ReactElement => {
  const { containerId, ...dialogProps } = props;
  return (
    <Dialog
      style={{ position: "absolute" }}
      BackdropProps={{ style: { position: "absolute" } }}
      container={() => document.getElementById(containerId)}
      {...dialogProps}
    />
  );
};

export default AnchoredDialog;
