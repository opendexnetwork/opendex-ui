import { FormControl, NativeSelect } from "@material-ui/core";
import React, { ReactElement } from "react";

type SelectProps = {
  value: string | undefined;
  options: string[];
  name: string;
  onChange: (value: string) => void;
};

const Select = (props: SelectProps): ReactElement => {
  return (
    <FormControl>
      <NativeSelect
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        name={props.name}
      >
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default Select;
