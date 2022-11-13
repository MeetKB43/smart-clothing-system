import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid } from '@mui/material';
import { getProfilesList } from '../api/Profile';
import { PrivateWrapper } from '../components/layouts';
import useToastr from '../hooks/useToastr';
import Notifications from '../components/home/Suggestions';
import { RoutePaths, USER_ACTIONS } from '../configs';
import InventoryInfoCard from '../components/inventory/InventoryInfoCard';
import { getSuggestionsList } from '../api/Suggestions';
import ActionButton from '../components/home/ActionButton';

const DEVICE_ID = new uuid.DeviceUUID().get();

const Home = () => {
  const pageName = 'Home';
  const { showErrorToastr } = useToastr();

  const [rows, setRows] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadError, setDataLoadError] = useState('');

  useEffect(() => {
    setDataLoaded(false);
    setDataLoadError('');
    getProfilesList({ deviceID: DEVICE_ID })
      .then((data) => {
        setRows([
          ...data.map((d) => ({
            ...d,
            name: d.username,
            totalClothes: 10,
            washedClothes: 6,
            unwashedClothes: 4,
          })),
        ]); // TODO: delete static data later

        setDataLoaded(true);
      })
      .catch(({ response }) => {
        setRows([]);
        setDataLoadError(response?.data || 'Something went wrong.');
        showErrorToastr('Error fetching data. Please refresh the page.');
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    setSuggestionsLoaded(false);
    setDataLoadError('');
    getSuggestionsList({ deviceID: DEVICE_ID })
      .then((data) => {
        setSuggestions(data);
        setSuggestionsLoaded(true);
      })
      .catch(({ response }) => {
        setRows([]);
        setDataLoadError(response?.data || 'Something went wrong.');
        showErrorToastr('Error fetching data. Please refresh the page.');
        setSuggestionsLoaded(true);
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
            {rows.map((r) => (
              <Grid key={r.username} item xs={12} md={6}>
                <InventoryInfoCard
                  heading={r.username}
                  totalClothes={r.totalClothes}
                  washedClothes={r.washedClothes}
                  unwashedClothes={r.unwashedClothes}
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
          </Grid>
        </Grid>
      </Grid>
    </PrivateWrapper>
  );
};

export default Home;
