import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "../dashboard/unlockOpendexd/node_modules/@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { ChangeEvent, ReactElement, useState } from "../dashboard/unlockOpendexd/node_modules/react";

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
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default Password;
