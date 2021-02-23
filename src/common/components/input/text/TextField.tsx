import {
  TextField as MaterialTextField,
  TextFieldProps as MaterialTextFieldProps,
} from "@material-ui/core";
import React, { ReactElement } from "react";

export type TextFieldProps = MaterialTextFieldProps & {
  startAdornment?: ReactElement;
  endAdornment?: ReactElement;
  inputProps?: any;
};

const TextField = (props: TextFieldProps): ReactElement => {
  const { startAdornment, endAdornment, inputProps, ...fieldProps } = props;

  return (
    <MaterialTextField
      variant="outlined"
      InputProps={{
        endAdornment: endAdornment,
        startAdornment: startAdornment,
        inputProps: inputProps,
        ...props.InputProps,
      }}
      {...fieldProps}
    />
  );
};

export default TextField;
