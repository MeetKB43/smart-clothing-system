import React, { useRef, useState } from 'react';
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
import { registerDevice } from '../../api/Auth';
import useToastr from '../../hooks/useToastr';
import RoutePaths from '../../configs/Routes';

const Register = () => {
  const { control, handleSubmit, watch } = useForm();
  const { showSuccessToastr, showErrorToastr } = useToastr();

  const [processing, setProcessing] = useState(false);

  const pin = useRef({});
  pin.current = watch('pin', '');

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      if (data.pin !== data.confirmPin) {
        showErrorToastr('Pin and confirm pin does not match.');
        return;
      }
      const toSubmitData = {
        deviceID: new uuid.DeviceUUID().get(),
        devicename: data.deviceName,
        pin: data.pin,
      };
      await registerDevice(toSubmitData);
      showSuccessToastr('Logged in successfully.');
      window.localStorage.setItem('isLoggedIn', true);
      window.location.assign(RoutePaths.HOME);
      setProcessing(false);
    } catch (error) {
      showErrorToastr(error?.message || 'Something went wrong.');
      setProcessing(false);
    }
  };

  return (
    <PublicWrapper>
      <Box
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Register Device
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    id="deviceName"
                    name="deviceName"
                    rules={{ ...Validations.REQUIRED }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        required
                        id="deviceName"
                        name="deviceName"
                        label="Device Name"
                        fullWidth
                        variant="standard"
                        type="text"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error?.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    id="pin"
                    name="pin"
                    rules={{
                      ...Validations.REQUIRED,
                      ...{
                        maxLength: {
                          value: 6,
                          message: `Pin must be to 6 characters long.`,
                        },
                      },
                      ...{
                        minLength: {
                          value: 6,
                          message: `Pin must be to 6 characters long.`,
                        },
                      },
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: 'Numbers are only allowed.',
                      },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                        error={!!error}
                        helperText={error ? error?.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    id="confirmPin"
                    name="confirmPin"
                    rules={{
                      ...Validations.REQUIRED,
                      ...{
                        maxLength: {
                          value: 6,
                          message: `Pin must be to 6 characters long.`,
                        },
                      },
                      ...{
                        minLength: {
                          value: 6,
                          message: `Pin must be to 6 characters long.`,
                        },
                      },
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: 'Numbers are only allowed.',
                      },
                      validate: (value) => value === pin.current || 'Provided pins does not match',
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        required
                        id="confirmPin"
                        name="confirmPin"
                        label="Confirm Pin"
                        fullWidth
                        variant="standard"
                        type="password"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error?.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="body2">
                    Have an account?{' '}
                    <Link href="/login" underline="hover">
                      Sign In
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
                    {processing ? 'Registering' : 'Register'}
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

export default Register;
