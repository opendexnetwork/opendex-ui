import {
  ListItemIcon,
  Tooltip,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ComponentClass, ElementType, ReactElement } from "react";
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import { Path } from "../../../router/Path";

export type MenuItemProps = {
  path: Path;
  text: string;
  component: ComponentClass<any> | (() => ReactElement);
  icon: ElementType;
  isFallback?: boolean;
  isDisabled?: boolean;
  tooltipTextRows?: string[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disabled: {
      color: theme.palette.text.disabled,
    },
  })
);

function MenuItem(props: MenuItemProps): ReactElement {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const classes = useStyles();
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
        className={props.isDisabled ? classes.disabled : ""}
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
