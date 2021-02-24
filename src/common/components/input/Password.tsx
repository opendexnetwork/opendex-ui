import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { ChangeEvent, ReactElement, useState } from "react";
import IconButton from "./buttons/IconButton";
import TextField from "./text/TextField";

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
    <TextField
      label={label}
      id={label}
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
  );
};

export default Password;
