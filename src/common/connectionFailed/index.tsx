import {
  Button,
  Typography
} from "@material-ui/core";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Path } from "../../router/Path";
import { isElectron, sendMessageToParent } from "../appUtil";

//styles
import {
  Container,
  Row
} from "./styles";

const ConnectionFailed = (): ReactElement => {
  const history = useHistory();

  useEffect(() => {
    if (isElectron()) {
      sendMessageToParent("connectionFailed");
    }
  }, []);

  return (
    <Container
      item
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Row item>
        <Typography variant="h6" component="h2">
          Failed to get data
        </Typography>
      </Row>
      <Row item>
        <Button variant="outlined" onClick={() => history.push(Path.DASHBOARD)}>
          Try again
        </Button>
      </Row>
    </Container>
  );
};

export default ConnectionFailed;
