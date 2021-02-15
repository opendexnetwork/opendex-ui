import { CircularProgress } from "@material-ui/core";
import React, { ReactElement } from "react";

//styles
import { Container } from "./styles";

const PageCircularProgress = (): ReactElement => {
  return (
    <Container>
      <CircularProgress color="inherit" />
    </Container>
  );
};

export default PageCircularProgress;
