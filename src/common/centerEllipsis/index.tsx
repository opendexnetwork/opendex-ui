import React, { ReactElement } from "react";

//styles
import {
  Left,
  Right
} from "./styles";

type PropsType = {
  text: string;
};

function CenterEllipsis(props: PropsType): ReactElement {
  const { text } = props;
  const splitIndex =
    text.length > 4 ? text.length - 4 : Math.round(text.length * 0.75);

  const shrinkableText = text.slice(0, splitIndex);
  const endText = text.slice(splitIndex);

  return (
    <>
      <Left>{shrinkableText}</Left>
      <Right>{endText}</Right>
    </>
  );
}

export default CenterEllipsis;
