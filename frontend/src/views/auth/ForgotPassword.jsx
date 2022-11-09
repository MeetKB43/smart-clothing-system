import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { PublicWrapper } from '../../components/layouts';

const ForgotPassword = () => (
  <PublicWrapper>
    <Box
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Container component="main" maxWidth="sm" sx={{ mb: 4, textAlign: 'center' }}>
        Forgot Password Page
      </Container>
    </Box>
  </PublicWrapper>
);

export default ForgotPassword;
