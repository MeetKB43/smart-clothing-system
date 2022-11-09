import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  skeleton: {
    marginTop: 5,
    marginBottom: 5,
  },
});

const TableLoader = ({ rows, cols }) => {
  const classes = useStyles();
  const rowsArray = [...Array(rows)].map((item, index) => index);
  const colsArray = [...Array(cols)].map((item, index) => index);

  return (
    <>
      {rowsArray.map((r) => (
        <TableRow key={`t-l-${r}`}>
          {colsArray.map((c) => (
            <TableCell key={`t-l-${c}`}>
              <Skeleton variant="text" className={classes.skeleton} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

TableLoader.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
};

TableLoader.defaultProps = {
  rows: 5,
  cols: 5,
};

export default TableLoader;
