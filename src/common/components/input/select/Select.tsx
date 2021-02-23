import {
  FormControl,
  MenuItem,
  Select as MaterialSelect,
  SelectProps as MaterialSelectProps,
} from "@material-ui/core";
import React, { ReactElement } from "react";

type ValueType = string | number | undefined;

type SelectOption = {
  value: ValueType;
  text: string;
};

type SelectProps = MaterialSelectProps & {
  id: string;
  value: ValueType;
  options: SelectOption[];
};

const Select = (props: SelectProps): ReactElement => {
  const { value, options, id, ...selectProps } = props;

  return (
    <FormControl variant="outlined" fullWidth>
      <MaterialSelect id={id} value={value} {...selectProps}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.text}
          </MenuItem>
        ))}
      </MaterialSelect>
    </FormControl>
  );
};

export default Select;
