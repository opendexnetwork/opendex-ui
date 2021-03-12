import { ListItemIcon, Tooltip, makeStyles, Theme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ComponentClass, ElementType, ReactElement } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { Path } from "../../../router/Path";

export type MenuItemProps = {
  path: Path;
  text: string;
  component:
    | ComponentClass<any>
    | (() => ReactElement)
    | React.ReactElement<any>;
  icon: ElementType;
  isFallback?: boolean;
  isDisabled?: boolean;
  tooltipTextRows?: string[];
  isBeforeSelected?: boolean;
  isAfterSelected?: boolean;
  selected?: boolean;
};

const getListItemColor = (theme: Theme, props: MenuItemProps) => {
  return props.isDisabled
    ? theme.palette.text.disabled
    : props.selected
    ? "#d7d9e2"
    : "#9a9ca4";
};

const getListItemBorderRadius = (props: MenuItemProps) => {
  return props.isBeforeSelected
    ? "25px 0px 25px 25px"
    : props.isAfterSelected
    ? "25px 25px 0px 25px"
    : "25px 0px 0px 25px";
};

const getListItemBoxShadow = (props: MenuItemProps) => {
  return props.isBeforeSelected
    ? "30px 0px 0px #0c0c0c"
    : props.isAfterSelected
    ? "25px 0px 0px #0c0c0c"
    : "";
};

const useStyles = makeStyles((theme) => ({
  listItem: (props: MenuItemProps) => ({
    height: "50px",
    color: getListItemColor(theme, props),
    borderRadius: getListItemBorderRadius(props),
    boxShadow: getListItemBoxShadow(props),
    backgroundColor: props.selected ? "#0c0c0c" : "",
    "&.MuiListItem-root:hover": {
      color: "#d7d9e2",
      backgroundColor: !props.selected
        ? "rgba(255, 255, 255, 0.08)"
        : "#0c0c0c",
    },
  }),
  listIcon: {
    color: "inherit",
  },
}));

function MenuItem(props: MenuItemProps): ReactElement {
  const { url } = useRouteMatch();
  const classes = useStyles(props);
  const navigateTo = `${url}${props.path}`;

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
        className={classes.listItem}
        button={!props.isDisabled as any}
        component={props.isDisabled ? "div" : NavLink}
        to={navigateTo}
      >
        <ListItemIcon className={classes.listIcon}>
          <props.icon />
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItem>
    </Tooltip>
  );
}

export default MenuItem;
