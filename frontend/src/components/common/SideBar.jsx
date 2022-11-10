import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CloseIcon from '@mui/icons-material/MenuOpen';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssistantIcon from '@mui/icons-material/Assistant';
import { NAV_DRAWER_WIDTH, RoutePaths } from '../../configs';
import NavItem from './NavItem';
// import Logo from '../../assets/images/closet.png';

const SideBar = ({ open, onClose }) => (
  <Drawer
    open={open}
    variant="persistent"
    anchor="left"
    onClose={onClose}
    sx={{
      width: NAV_DRAWER_WIDTH,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        minWidth: NAV_DRAWER_WIDTH,
        bgcolor: 'background.paper',
      },
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        height: 80,
        flexShrink: 0,
        px: 0.5,
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        backgroundColor: 'inherit',
        backgroundImage: 'inherit',
      }}
    >
      <IconButton aria-label="Close navigation drawer" onClick={onClose} size="large">
        <CloseIcon />
      </IconButton>
    </Stack>

    <nav>
      <List disablePadding>
        <li>
          <NavItem to={RoutePaths.HOME}>
            <ListItemIcon>
              <AssessmentOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </NavItem>
        </li>
        <li>
          <NavItem to={RoutePaths.INVENTORY}>
            <ListItemIcon>
              <Inventory2OutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </NavItem>
        </li>
        <li>
          <NavItem to={RoutePaths.SUGGESTIONS}>
            <ListItemIcon>
              <AssistantIcon />
            </ListItemIcon>
            <ListItemText primary="Suggestions" />
          </NavItem>
        </li>
        <li>
          <NavItem to={RoutePaths.PROFILES}>
            <ListItemIcon>
              <PeopleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Profiles" />
          </NavItem>
        </li>
        <Divider variant="middle" sx={{ my: 1 }} />
        <li>
          <NavItem to={RoutePaths.LOGOUT}>
            <ListItemIcon>
              <ExitToAppOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </NavItem>
        </li>
      </List>
    </nav>
  </Drawer>
);

SideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideBar;
