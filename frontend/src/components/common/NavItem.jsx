/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

export default function NavItem(props) {
  const { pathname } = useLocation();

  return (
    <MenuItem
      component={Link}
      selected={pathname === props.to}
      {...props}
      sx={{
        ...props.sx,
        '&&::before': {
          left: 'auto',
          right: 0,
        },
      }}
    />
  );
}
