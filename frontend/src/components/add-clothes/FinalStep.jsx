import React from 'react';

import { Box, Button } from '@mui/material';

const FinalStep = () => (
  <Box display="flex" sx={{ my: 4 }} flexDirection="column">
    Your Cloth has been added into the system successfully. Please generete RFID tag.
    <Button sx={{ mt: 4 }}>Get RFID</Button>
  </Box>
);

export default FinalStep;
