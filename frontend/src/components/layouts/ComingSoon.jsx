import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PublicWrapper from './Public';

const ComingSoon = ({ pageName }) => (
  <PublicWrapper>
    <Box
      height="90vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Container maxWidth="xs">
        <Typography variant="h5">{`${pageName} page coming soon !`}</Typography>
      </Container>
    </Box>
  </PublicWrapper>
);

ComingSoon.propTypes = {
  pageName: PropTypes.string,
};
ComingSoon.defaultProps = {
  pageName: '',
};

export default ComingSoon;
