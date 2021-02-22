import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { ChangeEvent, ReactElement, useState } from "react";
import IconButton from "./buttons/IconButton";

type PasswordProps = {
  label?: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const Password = (props: PasswordProps): ReactElement => {
  const { value, onChange } = props;
  const label = props.label || "Password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor={label}>{label}</InputLabel>
      <OutlinedInput
        id={label}
        labelWidth={label.length * 9}
        value={value}
        onChange={(event) => {
          onChange(event);
        }}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              icon={showPassword ? <Visibility /> : <VisibilityOff />}
              tooltipTitle={""}
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default Password;
