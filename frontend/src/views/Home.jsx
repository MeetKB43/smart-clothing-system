import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid, Button, Card, Typography, lighten } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ArrowRightAltOutlined } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { PrivateWrapper } from '../components/layouts';
import useToastr from '../hooks/useToastr';
import Notifications from '../components/home/Suggestions';
import { RoutePaths, USER_ACTIONS } from '../configs';
import ActionButton from '../components/home/ActionButton';
import { getOverview } from '../api/Clothes';

import bannerImage from '../assets/images/welcome-banner.svg';

const DEVICE_ID = new uuid.DeviceUUID().get();

const Home = () => {
  const pageName = 'Home';
  const history = useHistory();
  const { showErrorToastr } = useToastr();

  const [suggestions, setSuggestions] = useState([]);

  const [weatherData, setWeatherData] = useState({});
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadError, setDataLoadError] = useState('');

  useEffect(() => {
    setDataLoaded(false);
    setSuggestionsLoaded(false);
    setDataLoadError('');
    getOverview(DEVICE_ID)
      .then((data) => {
        setWeatherData(data?.WeatherDetails);
        setSuggestions(data?.Notification?.slice(0, 2) || []);
        setDataLoaded(true);
        setSuggestionsLoaded(true);
      })
      .catch(({ response }) => {
        setDataLoadError(response?.data || 'Something went wrong.');
        showErrorToastr('Error fetching data. Please refresh the page.');
        setDataLoaded(true);
      });
  }, []);

  if (!dataLoaded) {
    return (
      <PrivateWrapper pageName={pageName}>
        <Box p={5} display="flex" height="90vh" alignItems="center" justifyContent="center">
          {dataLoadError || <CircularProgress size={25} />}
        </Box>
      </PrivateWrapper>
    );
  }

  return (
    <PrivateWrapper pageName={pageName}>
      <Grid container sx={{ mt: 2 }} spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card
                elevation={8}
                sx={{ p: 3, backgroundColor: (theme) => lighten(theme.palette.primary.main, 0.8) }}
              >
                <Typography variant="h4">Welcome</Typography>
                <Grid container spacing={3}>
                  <Grid item spacing={3} xs={6}>
                    <Box sx={{ py: 3 }}>
                      <Typography variant="h5">{weatherData['Min. feels like']}&#8451;</Typography>
                      <Box display="flex" sx={{ pt: 2 }} flexDirection="row" alignItems="center">
                        <Typography variant="h6">{weatherData.city || 'Windsor'}</Typography>
                        <LocationOnIcon />
                      </Box>
                      <Typography variant="subtitle1" sx={{ pt: 2 }}>
                        {weatherData['Max. Temp.']} &#8451; / {weatherData['Min. Temp.']} &#8451;
                        Feels like {weatherData['Min. feels like']} &#8451;
                      </Typography>
                    </Box>
                    <Button
                      color="primary"
                      variant="contained"
                      endIcon={<ArrowRightAltOutlined />}
                      onClick={() => history.push(RoutePaths.INVENTORY)}
                    >
                      Go to Inventory
                    </Button>
                  </Grid>
                  <Grid item spacing={3} xs={6}>
                    <Grid item xs={6} sx={{ display: { xs: 'none', sm: 'none', lg: 'block' } }}>
                      <img src={bannerImage} alt="banner_image" />
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Notifications isLoading={!suggestionsLoaded} suggestionsData={suggestions} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid item xs={12}>
            <ActionButton action={USER_ACTIONS.PUT_WASHED_CLOTH} />
            <ActionButton action={USER_ACTIONS.PUT_UNWASHED_CLOTH} />
          </Grid>
        </Grid>
      </Grid>
    </PrivateWrapper>
  );
};

export default Home;
