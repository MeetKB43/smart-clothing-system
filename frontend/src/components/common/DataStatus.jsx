import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { DataStatus } from '../../configs';

const Status = ({ value }) => (
  <Box
    sx={{
      color: value === DataStatus.ACTIVE ? '#00cc00' : '#e60000',
      background: value === DataStatus.ACTIVE ? '#ccffcc' : '#ffd7cc',
      width: 100,
      borderRadius: 4,
      paddingY: '1px',
    }}
  >
    <Typography>{DataStatus[value]}</Typography>
  </Box>
);

Status.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Status;
