import React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    minHeight: '95vh',
    maxWidth: 'none',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
  },
}));

const PublicWrapper = ({ children }) => {
  const classes = useStyles();

  return (
    <Container className={classes.wrapper} maxWidth="xl">
      {children}
    </Container>
  );
};

PublicWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PublicWrapper;
