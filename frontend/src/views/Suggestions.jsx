import React, { useState, useEffect } from 'react';
import * as uuid from 'device-uuid';
import { CircularProgress, Box, Grid } from '@mui/material';
import { PrivateWrapper } from '../components/layouts';
import useToastr from '../hooks/useToastr';
import SuggestionTile from '../components/home/SuggestionTile';
import { getOverview } from '../api/Clothes';

const DEVICE_ID = new uuid.DeviceUUID().get();

const Suggestions = () => {
  const pageName = 'Suggestions';
  const { showErrorToastr } = useToastr();

  const [rows, setRows] = useState([]);
  const [dataLoadError, setDataLoadError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setDataLoaded(false);
    getOverview(DEVICE_ID)
      .then((data) => {
        setRows(data?.Notification || []); // TODO: delete static data later
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
