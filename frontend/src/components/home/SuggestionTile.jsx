import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, lighten, darken } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

const SuggestionTile = ({ data }) => {
  const theme = useTheme();
  const getBgValue = (priority, lightenBy) => {
    switch (priority) {
      case 1:
        return lighten(theme.palette.error.light, lightenBy);

      case 2:
        return lighten(theme.palette.warning.light, lightenBy);

      default:
        return lighten(theme.palette.primary.light, lightenBy);
    }
  };

  const getColorValue = (priority, darkenBy) => {
    switch (priority) {
      case 1:
        return darken(theme.palette.error.light, darkenBy);

      case 2:
        return darken(theme.palette.warning.light, darkenBy);

      default:
        return darken(theme.palette.primary.light, darkenBy);
    }
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            cursor: 'pointer',
            backgroundColor: getBgValue(data.priority, 0.5),
            color: getColorValue(data.priority, 0.5),
            p: 1,
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Grid item>
            <Typography variant="subtitle2" color="inherit">
              {data.title}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

SuggestionTile.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
  }).isRequired,
};

export default SuggestionTile;
