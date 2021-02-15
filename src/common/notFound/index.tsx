import React, { ReactElement } from "react";
import notFoundImg from "../../assets/404.png";

//styles
import { Container } from "./styles";

const NotFound = (): ReactElement => {
  return (
    <Container
      item
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      <img src={notFoundImg} alt="Page not found" />
    </Container>
  );
};

export default NotFound;
