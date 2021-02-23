import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import React, { ReactElement } from "react";
import { copyToClipboard } from "../../../utils/appUtil";
import IconButton from "../../input/buttons/IconButton";
import CenterEllipsis from "../CenterEllipsis";

export type TableRow = {
  [key: string]: string | number | boolean | Date | ReactElement | undefined;
};

export type TableHeader<T extends TableRow> = {
  label: string;
  key: keyof T;
  copyIcon?: boolean;
  gridsXs?: 1 | 2 | 3 | 4;
  gridsXl?: 1 | 2 | 3 | 4;
};

type TableProps<T extends TableRow> = {
  headers: TableHeader<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  defaultGridXs: 1 | 2 | 3 | 4;
  defaultGridXl: 1 | 2 | 3 | 4;
  actionColumn?: { title: string; content: ReactElement };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContent: {
      flexWrap: "nowrap",
      overflowY: "auto",
    },
    tableCell: {
      padding: theme.spacing(1),
    },
    tableCellIcon: {
      marginLeft: theme.spacing(1),
    },
    tableCellTextContainer: {
      display: "flex",
      alignItems: "center",
    },
  })
);

function Table<T extends TableRow>(props: TableProps<T>): ReactElement {
  const { headers, rows, getRowId, defaultGridXs, defaultGridXl } = props;
  const classes = useStyles();
  const getDisplayValue = (
    row: T,
    prop: keyof T
  ): string | number | ReactElement => {
    const value = row[prop];
    return value instanceof Date
      ? value.toLocaleString("en-GB")
      : (value as string | number | ReactElement);
  };

  return (
    <>
      <Grid item container justify="space-between" wrap="nowrap">
        {(headers || []).map((header) => (
          <Grid
            key={header.key as string}
            item
            container
            xs={header.gridsXs || defaultGridXs}
            xl={header.gridsXl || header.gridsXs || defaultGridXl}
            className={classes.tableCell}
          >
            <Typography component="span" variant="body1">
              {header.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Grid item container direction="column" className={classes.tableContent}>
        {(rows || []).map((row) => (
          <Grid
            item
            container
            justify="space-between"
            wrap="nowrap"
            key={getRowId(row)}
          >
            {headers.map((column) => (
              <Grid
                item
                container
                xs={column.gridsXs || defaultGridXs}
                xl={column.gridsXl || column.gridsXs || defaultGridXl}
                className={classes.tableCell}
                key={`${getRowId(row)}_${column.key}`}
              >
                {column.copyIcon && row[column.key] ? (
                  <Grid container item wrap="nowrap" alignItems="center">
                    <CenterEllipsis text={row[column.key] + ""} />
                    <IconButton
                      icon={<FileCopyOutlinedIcon fontSize="inherit" />}
                      tooltipTitle="Copy to clipboard"
                      size="small"
                      className={classes.tableCellIcon}
                      onClick={() => {
                        const value = getDisplayValue(row, column.key);
                        if (["string", "number"].includes(typeof value)) {
                          copyToClipboard(
                            getDisplayValue(row, column.key) as string | number
                          );
                        }
                      }}
                    />
                  </Grid>
                ) : (
                  <Typography
                    variant="body2"
                    component="span"
                    className={classes.tableCellTextContainer}
                  >
                    {getDisplayValue(row, column.key)}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Table;
