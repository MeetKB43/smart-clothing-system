import React from 'react';
import Box from '@mui/material/Box';
import { PublicWrapper, StaticDrawer } from '../components';

const Home = () => (
  <PublicWrapper>
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <StaticDrawer />
    </Box>
  </PublicWrapper>
);

export default Home;
