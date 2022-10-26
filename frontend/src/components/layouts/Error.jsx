import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

const ErrorWrapper = ({ children }) => <Container maxWidth="xl">{children}</Container>;

ErrorWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ErrorWrapper;
