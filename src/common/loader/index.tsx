import { CircularProgress } from "@material-ui/core";
import React, { ReactElement } from "react";

//styles
import { LoaderContainer } from "./styles";

const Loader = (): ReactElement => {

  return (
    <LoaderContainer container >
      <CircularProgress color="inherit" />
    </LoaderContainer>
  );
};

export default Loader;
