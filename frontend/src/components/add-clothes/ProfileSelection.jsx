import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Grid, CircularProgress, Box } from '@mui/material';
import Proptypes from 'prop-types';
import { displayProfiles } from '../../api/Profile';
import useToastr from '../../hooks/useToastr';

const ProfileSelection = ({ setActiveStep }) => {
  // eslint-disable-next-line no-unused-vars
  const [profiles, setProfiles] = useState([]);

  const { showErrorToastr } = useToastr();

  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    setProcessing(true);
    displayProfiles()
      .then((res) => {
        setProfiles(res);
        setProcessing(false);
      })
      .catch((error) => {
        showErrorToastr(
          error?.response?.data?.message || error?.message || 'Something went wrong.'
        );
        setProcessing(false);
      });
  }, []);

  if (processing) {
    return (
      <Box p={5} display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={25} />
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        {profiles.map((p) => (
          <Grid key={p.uID} item xs={12} md={6}>
            <ListItemButton onClick={() => setActiveStep(1)} alignItems="center">
              <ListItemAvatar>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemAvatar>
              <ListItemText primary={p.username} />
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
