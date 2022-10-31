import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AddNewProfile from '../../views/AddProfile';
import AddClothForm from '../add-clothes/AddClothForm';
import Inventory from '../../views/InventoryPage/Inventory';

const drawerWidth = 240;

export default function StaticDrawer() {
  const [state, setState] = React.useState('Add new Profile');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Smart Clothing System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Inventory Management', 'Suggestions', 'Add New Clothes', 'Add new Profile'].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} onClick={() => setState(text)} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <>
        {state === 'Inventory Management' ? <Inventory /> : null}
        {state === 'Add new Profile' ? <AddNewProfile /> : null}
        {state === 'Suggestions' ? <h1 key={state}>Hello Suggestions</h1> : null}
        {state === 'Add New Clothes' ? <AddClothForm /> : null}
        <></>
      </>
    </Box>
  );
}
