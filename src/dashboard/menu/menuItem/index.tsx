import {
  ListItemIcon,
  Tooltip
} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ComponentClass, ElementType, ReactElement } from "react";
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import { Path } from "../../../router/Path";

//styles
import { ListItem } from "./styles";

export type MenuItemProps = {
  path: Path;
  text: string;
  component: ComponentClass<any> | (() => ReactElement);
  icon: ElementType;
  isFallback?: boolean;
  isDisabled?: boolean;
  tooltipTextRows?: string[];
};

function MenuItem(props: MenuItemProps): ReactElement {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const navigateTo = `${url}${props.path}`;

  const isCurrentLocation = (): boolean => {
    return navigateTo === pathname || (!!props.isFallback && url === pathname);
  };

  return (
    <Tooltip
      placement="bottom-end"
      title={
        props.isDisabled
          ? props.tooltipTextRows!.map((row) => <div key={row}>{row}</div>)
          : ""
      }
    >
      <ListItem
        isDisabled={props.isDisabled}
        button={!props.isDisabled as any}
        component={props.isDisabled ? "div" : NavLink}
        to={navigateTo}
        selected={isCurrentLocation()}
      >
        <ListItemIcon>
          <props.icon color={props.isDisabled ? "disabled" : "inherit"} />
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItem>
    </Tooltip>
  );
}

export default MenuItem;
