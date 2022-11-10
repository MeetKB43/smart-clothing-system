import React from 'react';
import PropTypes from 'prop-types';
import { Fade, Stack, Typography, CircularProgress } from '@mui/material';

export default function Loader({ message, fullScreen, ...otherProps }) {
  const fullScreenHeight = '100vh';

  return (
    <Fade in timeout={1000} style={{ transitionDelay: '1s' }} unmountOnExit>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={1}
        {...otherProps}
        style={{
          width: '100%',
          height: fullScreen ? fullScreenHeight : '100%',
          alignItems: 'center',
          ...otherProps.style,
        }}
      >
        <CircularProgress />
        <Typography variant="subtitle1" component="div" style={{ userSelect: 'none' }}>
          {message}
        </Typography>
      </Stack>
    </Fade>
  );
}

Loader.defaultProps = {
  message: 'Loading',
  fullScreen: false,
};

Loader.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
};
