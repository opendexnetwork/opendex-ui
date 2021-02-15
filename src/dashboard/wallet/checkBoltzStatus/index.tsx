import {
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement } from "react";
import { copyToClipboard } from "../../../common/appUtil";

//styles
import {
  Row,
  Code,
  IconContainer
} from "./styles";

type CheckBoltzTransactionStatusProps = {
  currency: string;
  id: string;
};

const CheckBoltzTransactionStatus = (
  props: CheckBoltzTransactionStatusProps
): ReactElement => {
  const { currency, id } = props;
  const command = `boltzcli ${currency} swapinfo ${id}`;

  return (
    <Grid item container direction="column" justify="center">
      <Divider />
      <Row item container justify="center">
        <Typography variant="caption">
          To check status, open the Console tab and run
        </Typography>
      </Row>
      <Row
        item
        container
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Code
            component="span"
            variant="caption"
          >
            {command}
          </Code>
        </Grid>
        <IconContainer item>
          <Tooltip title="Copy">
            <IconButton onClick={() => copyToClipboard(command)}>
              <FileCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </IconContainer>
      </Row>
    </Grid>
  );
};

export default CheckBoltzTransactionStatus;
