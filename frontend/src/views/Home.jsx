import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid } from '@mui/material';
import GoogleLogin from 'react-google-login';
import { PrivateWrapper } from '../components/layouts';
import useToastr from '../hooks/useToastr';
import Notifications from '../components/home/Suggestions';
import { RoutePaths, USER_ACTIONS } from '../configs';
import InventoryInfoCard from '../components/inventory/InventoryInfoCard';
import ActionButton from '../components/home/ActionButton';
import { getOverview } from '../api/Clothes';
import { createGoogleTokens } from '../api/Auth';

const DEVICE_ID = new uuid.DeviceUUID().get();

const Home = () => {
  const pageName = 'Home';
  const { showErrorToastr } = useToastr();

  const [deviceUsers, setDeviceUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadError, setDataLoadError] = useState('');
  const [isCalendarAccessGranted, setIsCalendarAccessGranted] = useState(false);

  useEffect(() => {
    setDataLoaded(false);
    setSuggestionsLoaded(false);
    setDataLoadError('');
    getOverview(DEVICE_ID)
      .then((data) => {
        setDeviceUsers(data?.userOverview || []);
        setSuggestions(data?.Notification || []);
        setDataLoaded(true);
        setSuggestionsLoaded(true);
      })
      .catch(({ response }) => {
        setDeviceUsers([]);
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

  const handleLoginSuccess = async ({ code }) => {
    try {
      await createGoogleTokens(code);
      setIsCalendarAccessGranted(true);
    } catch (error) {
      showErrorToastr(error?.message || 'Error allowing access of the calendar. Please try again.');
    }
  };

  const handleLoginFailure = () => {};

  return (
    <PrivateWrapper pageName={pageName}>
      <Grid container sx={{ mt: 2 }} spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {deviceUsers.map((r) => (
              <Grid key={r.username} item xs={12} md={6}>
                <InventoryInfoCard
                  heading={r.username}
                  totalClothes={r['Unwashed cloths'] + r['Washed cloths'] || '0'}
                  washedClothes={r['Washed cloths'] || '0'}
                  unwashedClothes={r['Unwashed cloths'] || '0'}
                  link={RoutePaths.USER_INVENTORY.replace(':uID', r.uID)}
                />
              </Grid>
            ))}
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
            <ActionButton action={USER_ACTIONS.TAKE_CLOTH} />

            {!isCalendarAccessGranted && (
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Grant Calendar Access"
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                cookiePolicy="single_host_origin"
                responseType="code"
                accessType="offline"
                scope="openid email profile https://www.googleapis.com/auth/calendar"
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </PrivateWrapper>
  );
};

export default Home;
