import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useHistory } from 'react-router-dom';
import { ErrorWrapper } from '../components/layouts';
import { RoutePaths } from '../configs';

// 404 Page
const NotFound = () => {
  const pageName = '404';
  const history = useHistory();

  const handleClick = () => {
    history.replace(RoutePaths.HOME);
  };

  return (
    <ErrorWrapper>
      <Grid
        container
        spacing={0}
        height="100vh"
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        <Box
          maxWidth="xs"
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Container component="div">
            <Typography component="h1" variant="h1" align="center">
              {pageName}
            </Typography>
            <Typography component="p">The page you are looking for does not exist.</Typography>
          </Container>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Back Home
          </Button>
        </Box>
      </Grid>
    </ErrorWrapper>
  );
};

export default NotFound;
