import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Grid } from '@mui/material';
import Proptypes from 'prop-types';

const ClothCategorySelection = ({ setActiveStep }) => {
  // eslint-disable-next-line no-unused-vars
  const [clothCategory, setClothCategory] = useState([
    { name: 'Category 1' },
    { name: 'Category 2' },
    { name: 'Category 3' },
    { name: 'Category 4' },
    { name: 'Category 5' },
    { name: 'Category 6' },
    { name: 'Category 7' },
    { name: 'Category 8' },
  ]);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        {clothCategory.map((p) => (
          <Grid item xs={12} md={6}>
            <ListItemButton onClick={() => setActiveStep((ps) => ps + 1)} alignItems="center">
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

ClothCategorySelection.propTypes = {
  setActiveStep: Proptypes.func.isRequired,
};

export default ClothCategorySelection;
