import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router';
import { Box, Container } from '@mui/material';
import { Navbar } from '../common';

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

const PrivateWrapper = ({ pageName, children }) => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    document.title = pageName;
  }, [history, pageName]);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      history.push('/logout');
    }
  }, [pageName]);

  return (
    <Box className={classes.wrapper}>
      <Navbar title={pageName} open={open} setOpen={setOpen} />
      <Container
        sx={{ ...(open && { marginLeft: '240px', width: `calc(100% - 240px)` }) }}
        className={classes.content}
      >
        {children}
      </Container>
    </Box>
  );
};

PrivateWrapper.propTypes = {
  pageName: PropTypes.string,
  children: PropTypes.element.isRequired,
};
PrivateWrapper.defaultProps = {
  pageName: '',
};

export default PrivateWrapper;
