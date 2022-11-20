import React from 'react';
import { useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { Card, Divider, CardContent, Typography, Button } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

const InventoryInfoCard = ({ heading, totalClothes, washedClothes, unwashedClothes, link }) => {
  const history = useHistory();

  return (
    <Card
      elevation={8}
      onClick={() => history.push(link)}
      component={Button}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent style={{ paddingBottom: 0 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {heading.split(' ')[0] ? heading.split(' ')[0] : heading}
        </Typography>
      </CardContent>
      <CardContent style={{ flexGrow: 1, p: 0, m: 0 }}>
        <Box display="flex">
          <Box sx={{ mr: 3 }}>
            <ListItemText
              sx={{ p: 0, m: 0 }}
              primary={
                <Typography sx={{ p: 0, m: 0, fontSize: 18 }} variant="h6" component="div">
                  Total Clothes
                </Typography>
              }
              secondary={
                <Typography sx={{ p: 0, m: 0, fontSize: 16 }} variant="body" component="div">
                  {totalClothes}
                </Typography>
              }
            />
          </Box>
          <Divider />
          <Box sx={{ mr: 3 }}>
            <ListItemText
              sx={{ p: 0, m: 0 }}
              primary={
                <Typography sx={{ p: 0, m: 0, fontSize: 18 }} variant="h6" component="div">
                  Washed Clothes
                </Typography>
              }
              secondary={
                <Typography sx={{ p: 0, m: 0, fontSize: 16 }} variant="body" component="div">
                  {washedClothes}
                </Typography>
              }
            />
          </Box>
          <Divider />
          <Box sx={{ mr: 3 }}>
            <ListItemText
              sx={{ p: 0, m: 0 }}
              primary={
                <Typography sx={{ p: 0, m: 0, fontSize: 18 }} variant="h6" component="div">
                  Unwashed Clothes
                </Typography>
              }
              secondary={
                <Typography sx={{ p: 0, m: 0, fontSize: 16 }} variant="body" component="div">
                  {unwashedClothes}
                </Typography>
              }
            />
          </Box>
          <Divider />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ p: 0, m: 0 }} variant="body" component="div">
            You have {Math.ceil((washedClothes / totalClothes) * 100) || 0} % of washed clothes to
            wear in your closet.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

InventoryInfoCard.propTypes = {
  heading: Proptypes.string.isRequired,
  totalClothes: Proptypes.string.isRequired,
  washedClothes: Proptypes.string.isRequired,
  unwashedClothes: Proptypes.string.isRequired,
  link: Proptypes.string.isRequired,
};

export default InventoryInfoCard;
