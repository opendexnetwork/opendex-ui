import React, { ReactElement } from "react";
import NumberInput from "./NumberInput";
import TextField, { TextFieldProps } from "./TextField";

type NumberFieldProps = TextFieldProps & {
  decimalScale?: number;
  useTextInput?: boolean;
};

const NumberField = (props: NumberFieldProps): ReactElement => {
  const { decimalScale, useTextInput: useDefaultInput, ...fieldProps } = props;

  return (
    <TextField
      InputProps={{
        inputComponent: useDefaultInput ? undefined : (NumberInput as any),
        inputProps: useDefaultInput
          ? { ...fieldProps.inputProps }
          : { decimalScale: decimalScale, ...fieldProps.inputProps },
        ...props.InputProps,
      }}
      {...fieldProps}
    />
  );
};

export default NumberField;
