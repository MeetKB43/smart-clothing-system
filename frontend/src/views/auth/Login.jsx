import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Controller, useForm } from 'react-hook-form';
import { Link } from '@mui/material';
import * as uuid from 'device-uuid';
import PublicWrapper from '../../components/layouts/Public';
import Validations from '../../utils/Validations';
import { loginDevice, validateSession } from '../../api/Auth';
import useToastr from '../../hooks/useToastr';
import RoutePaths from '../../configs/Routes';

const Login = () => {
  const { control, handleSubmit } = useForm();

  const [processing, setProcessing] = useState(false);

  const { showSuccessToastr, showErrorToastr } = useToastr();

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const toSubmitData = {
        deviceID: new uuid.DeviceUUID().get(),
        pin: data.pin,
      };
      await loginDevice(toSubmitData);
      showSuccessToastr('Logged in successfully.');
      window.localStorage.setItem('isLoggedIn', true);
      window.location.assign(RoutePaths.HOME);
      setProcessing(false);
    } catch ({ response }) {
      showErrorToastr(response?.data || 'Something went wrong.');
      setProcessing(false);
    }
  };

  useEffect(() => {
    validateSession().then(() => {
      window.localStorage.setItem('isLoggedIn', true);
      window.location.assign(RoutePaths.HOME);
    });
  }, []);

  return (
    <PublicWrapper>
      <Box
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Login Device
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    id="pin"
                    name="pin"
                    rules={{ ...Validations.REQUIRED }}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        required
                        id="pin"
                        name="pin"
                        label="Pin"
                        fullWidth
                        variant="standard"
                        type="password"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="body2">
                    Create an account?{' '}
                    <Link href="/signup" underline="hover">
                      Register
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    endIcon={processing && <CircularProgress color="secondary" size={18} />}
                    disabled={processing}
                  >
                    {processing ? 'Logging in' : 'Login'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </PublicWrapper>
  );
};

export default Login;
