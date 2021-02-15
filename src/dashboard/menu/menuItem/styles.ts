import styled from "styled-components";
import $ListItem from "@material-ui/core/ListItem";
import { ElementType } from "react";

type ListItemType = {
  isDisabled?: boolean;
  component: ElementType;
  button: boolean;
  to: string;
  selected: boolean
}

export const ListItem = styled($ListItem)<ListItemType>`
  ${p => p.isDisabled && `
    color: ${p.theme.palette.text.disabled};
  `}
`;