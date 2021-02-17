import { makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";

type CodeProps = {
  text: string;
  backgroundColor?: "default" | "paper";
};

const useStyles = makeStyles((theme) => ({
  code: (props: CodeProps) => ({
    backgroundColor:
      props.backgroundColor === "default"
        ? theme.palette.background.default
        : theme.palette.background.paper,
    padding: `0px ${theme.spacing(1)}px`,
    borderRadius: 5,
    letterSpacing: 2,
    fontFamily: "monospace",
  }),
}));

const Code = (props: CodeProps): ReactElement => {
  const { text } = props;
  const classes = useStyles(props);

  return <span className={classes.code}>{text}</span>;
};

export default Code;
