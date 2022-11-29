import React from 'react';
import PropTypes from 'prop-types';
import { Button, CardActions, CardContent, Grid, Card, Typography, lighten } from '@mui/material';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Link } from 'react-router-dom';
import NotificationLoader from '../loaders/SuggestionLoader';
import { RoutePaths } from '../../configs';
import SuggestionTile from './SuggestionTile';

const Suggestions = ({ isLoading, suggestionsData }) => (
  <>
    {isLoading ? (
      <NotificationLoader />
    ) : (
      <Card
        elevation={8}
        content={false}
        sx={{ backgroundColor: (theme) => lighten(theme.palette.primary.main, 0.8) }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container alignContent="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h5">Notifications</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {suggestionsData.map((data) => (
                <SuggestionTile data={data} />
              ))}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
          <Button size="small" disableElevation component={Link} to={RoutePaths.SUGGESTIONS}>
            View All
            <ChevronRightOutlinedIcon />
          </Button>
        </CardActions>
      </Card>
    )}
  </>
);

Suggestions.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  suggestionsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Suggestions;
