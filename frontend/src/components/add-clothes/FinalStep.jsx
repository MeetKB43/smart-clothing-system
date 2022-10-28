import React from 'react';
import Proptypes from 'prop-types';
import { Box } from '@mui/material';

const FinalStep = ({ processing }) => (
  <Box display="flex" sx={{ my: 4 }} flexDirection="column">
    {processing
      ? 'Scanned cloth successfuly. Please wait while we add it into our system'
      : 'Your Cloth has been added into the system successfully.'}
  </Box>
);

FinalStep.propTypes = {
  processing: Proptypes.bool.isRequired,
};

export default FinalStep;
