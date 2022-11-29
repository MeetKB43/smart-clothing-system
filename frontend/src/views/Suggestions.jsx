import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid, Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { makeStyles } from '@mui/styles';
import { PrivateWrapper } from '../components/layouts';
import useToastr from '../hooks/useToastr';
import SuggestionTile from '../components/home/SuggestionTile';
import { getOverview } from '../api/Clothes';
import { createGoogleTokens } from '../api/Auth';

import TableListing from '../ui/styles/views/TableListing';

const DEVICE_ID = new uuid.DeviceUUID().get();
const useStyles = makeStyles(TableListing);

const Suggestions = () => {
  const pageName = 'Suggestions';
  const classes = useStyles();
  const { showSuccessToastr, showErrorToastr } = useToastr();

  const [rows, setRows] = useState([]);
  const [dataLoadError, setDataLoadError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isCalendarAccessGranted, setIsCalendarAccessGranted] = useState(
    localStorage.getItem('isCalendarAccessGranted')
  );

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        setDataLoaded(false);
        const data = await createGoogleTokens(code, DEVICE_ID);
        showSuccessToastr('Calendar access allowed successfully.');
        setRows(data || []);
        setDataLoaded(true);
        window.localStorage.setItem('isCalendarAccessGranted', true);
        setIsCalendarAccessGranted(true);
        setDataLoaded(true);
      } catch (error) {
        showErrorToastr(
          error?.message || 'Error allowing access of the calendar. Please try again.'
        );
        setRows([]);
        setDataLoaded(true);
      }
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
  });

  useEffect(() => {
    setDataLoaded(false);
    getOverview(DEVICE_ID)
      .then((data) => {
        setRows(data?.Notification || []);
        setDataLoaded(true);
      })
      .catch(({ response }) => {
        setRows([]);
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
      <div className={classes.filterToolbar}>
        <div className={classes.filterLeft} />
        <div className={classes.filterRight}>
          {!isCalendarAccessGranted && (
            <Button
              color="primary"
              variant="contained"
              sx={{
                p: 1,

                fontSize: 16,
                borderRadius: 1,
                mb: 1,
              }}
              onClick={login}
            >
              Grant calendar access
            </Button>
          )}
        </div>
      </div>

      <Grid container direction="column" sx={{ p: 2 }}>
        {rows.map((r) => (
          <Grid key={r.title} item>
            <SuggestionTile data={r} />
          </Grid>
        ))}
      </Grid>
    </PrivateWrapper>
  );
};

export default Suggestions;
