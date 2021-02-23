import {
  CheckboxProps as MaterialCheckboxProps,
  Checkbox as MaterialCheckbox,
  FormControlLabel,
} from "@material-ui/core";
import React, { ReactElement } from "react";

type CheckboxProps = MaterialCheckboxProps & {
  label: string;
};

const Checkbox = (props: CheckboxProps): ReactElement => {
  const { label, ...checkboxProps } = props;

  return (
    <FormControlLabel
      control={<MaterialCheckbox color="default" {...checkboxProps} />}
      label={label}
    />
  );
};

export default Checkbox;
