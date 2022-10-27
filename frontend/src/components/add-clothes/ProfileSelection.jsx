import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Grid } from '@mui/material';
import Proptypes from 'prop-types';

const ProfileSelection = ({ setActiveStep }) => {
  // eslint-disable-next-line no-unused-vars
  const [profiles, setProfiles] = useState([
    { name: 'Profile 2' },
    { name: 'Profile 3' },
    { name: 'Profile 4' },
    { name: 'Profile 5' },
  ]);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        {profiles.map((p) => (
          <Grid item xs={12} md={6}>
            <ListItemButton onClick={() => setActiveStep(1)} alignItems="center">
              <ListItemAvatar>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemAvatar>
              <ListItemText primary={p.name} />
            </ListItemButton>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

ProfileSelection.propTypes = {
  setActiveStep: Proptypes.func.isRequired,
};

export default ProfileSelection;
