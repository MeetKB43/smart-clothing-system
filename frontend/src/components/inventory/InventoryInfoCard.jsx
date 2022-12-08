import React from 'react';
import { useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { Card, Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Chart from 'react-apexcharts';

import fallbackAvatar from '../../assets/images/fallback_avatar.jpg';
import maleAvatar from '../../assets/images/avatar_male.jpg';
import femaleAvatar from '../../assets/images/avatar_female.jpg';

const getAvatarSrc = (gender) => {
  switch (gender) {
    case 'Female':
      return femaleAvatar;
    case 'Male':
      return maleAvatar;
    default:
      return fallbackAvatar;
  }
};
const InventoryInfoCard = ({
  heading,
  gender,
  totalClothes,
  washedClothes,
  unwashedClothes,
  link,
}) => {
  const history = useHistory();

  return (
    <Card component={Button} elevation={2} sx={{ p: 2 }} onClick={() => history.push(link)}>
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <img
            src={getAvatarSrc(gender)}
            alt="user_avatar"
            style={{
              width: '38px',
              height: '38px',
              marginRight: '8px',
              padding: '4px',
              borderRadius: '50%',
              color: 'rgb(54, 179, 126)',
              backgroundColor: 'rgba(54, 179, 126, 0.16)',
            }}
          />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {heading}
          </Typography>
        </Box>

        {totalClothes > 0 ? (
          <Chart
            options={{
              chart: { type: 'donut' },
              labels: [
                `${washedClothes} - Washed Clothes`,
                `${unwashedClothes} - Unwashed Clothes`,
              ],
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 150,
                    },
                    legend: {
                      position: 'bottom',
                    },
                  },
                },
              ],
            }}
            series={[
              Math.ceil((washedClothes / totalClothes) * 100),
              Math.ceil((unwashedClothes / totalClothes) * 100),
            ]}
            type="donut"
            width="380"
          />
        ) : (
          <Box py={2} display="flex" alignItems="center" justifyContent="center">
            <Box
              display="flex"
              sx={{
                // backgroundColor: (theme) => lighten(theme.palette.error.main, 0.8),
                color: (theme) => theme.palette.error.main,
              }}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body">No Clothes available in closet.</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

InventoryInfoCard.propTypes = {
  heading: Proptypes.string.isRequired,
  gender: Proptypes.string.isRequired,
  totalClothes: Proptypes.string.isRequired,
  washedClothes: Proptypes.string.isRequired,
  unwashedClothes: Proptypes.string.isRequired,
  link: Proptypes.string.isRequired,
};

export default InventoryInfoCard;
