import {
  FormControl,
  NativeSelect as MaterialNativeSelect,
} from "@material-ui/core";
import React, { ReactElement } from "react";

type SelectProps = {
  value: string | undefined;
  options: string[];
  name: string;
  onChange: (value: string) => void;
};

const NativeSelect = (props: SelectProps): ReactElement => {
  return (
    <FormControl>
      <MaterialNativeSelect
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        name={props.name}
      >
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </MaterialNativeSelect>
    </FormControl>
  );
};

export default NativeSelect;
