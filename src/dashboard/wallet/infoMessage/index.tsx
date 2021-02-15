import { Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

//styles
import { Card } from "./styles";

type InfoMessageProps = {
  message: string;
};

const InfoMessage = (props: InfoMessageProps): ReactElement => {
  const { message } = props;

  return (
    <Card elevation={0}>
      <Typography variant="body2" align="center">
        {message}
      </Typography>
    </Card>
  );
};

export default InfoMessage;
