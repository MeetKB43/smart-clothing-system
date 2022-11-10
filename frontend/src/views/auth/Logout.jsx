import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { PublicWrapper } from '../../components/layouts';
import { RoutePaths } from '../../configs';

// Logout page
const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    // TODO: Add logout service
    setTimeout(() => {
      // history.push(RoutePaths.LOGIN);  TODO: remove this once the auth flow is implemented
      history.push(RoutePaths.HOME);
    }, 1000);
  }, []);

  return (
    <PublicWrapper>
      <Box
        container
        spacing={0}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress color="inherit" size={24} sx={{ mr: 1 }} />
            <Typography component="p">Logging Out...</Typography>
          </div>
        </Container>
      </Box>
    </PublicWrapper>
  );
};

export default Logout;
