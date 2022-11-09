import React, { useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../configs';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to={RoutePaths.SETTINGS}>
          Settings
        </MenuItem>
        <MenuItem component={Link} to={RoutePaths.LOGOUT} onClick={() => true}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
