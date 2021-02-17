import React, { ReactElement } from "react";
import NumberFormat from "react-number-format";

type NumberInputProps = {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  decimalScale: number;
  negativeEnabled?: boolean;
};

const NumberInput = (props: NumberInputProps): ReactElement => {
  const { inputRef, onChange, negativeEnabled, decimalScale, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      decimalScale={decimalScale}
      allowNegative={!!negativeEnabled}
    />
  );
};

export default NumberInput;
