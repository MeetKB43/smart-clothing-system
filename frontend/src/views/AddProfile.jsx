import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Controller, useForm } from 'react-hook-form';
import { MenuItem } from '@mui/material';
import PublicWrapper from '../components/layouts/Public';
import Validations from '../utils';
import useToastr from '../hooks/useToastr';
import { addProfile } from '../api/Profile';

const AddProfile = () => {
  const { control, handleSubmit } = useForm();
  const { showErrorToastr, showSuccessToastr } = useToastr();

  const [processing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      // TODO: Add add profile service

      const toSubmitData = {
        username: `${data.firstName} ${data.lastName}`,
        firstname: data.firstName,
        lastname: data.lastName,
        pin: data.pin,
        age: data.age,
        gender: data.gender,
        city: data.city,
      };
      await addProfile(toSubmitData);
      showSuccessToastr('Added profile successfully.');
      setProcessing(false);
    } catch (error) {
      showErrorToastr('Error adding the profile.');
      setProcessing(false);
    }
  };

  return (
    <PublicWrapper>
      <Box
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add User Profile
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  id="firstName"
                  name="firstName"
                  rules={{ ...Validations.REQUIRED }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      id="firstName"
                      name="firstName"
                      label="First Name"
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
                  id="lastName"
                  name="lastName"
                  rules={{ ...Validations.REQUIRED }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      label="Last Name"
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
                  id="city"
                  name="city"
                  rules={{ ...Validations.REQUIRED }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      id="city"
                      name="city"
                      label="city"
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
                  id="age"
                  name="age"
                  rules={{ ...Validations.REQUIRED }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      id="age"
                      name="age"
                      label="Age"
                      fullWidth
                      variant="standard"
                      type="number"
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
                        value: 4,
                        message: `Value must be  equal to 4 characters.`,
                      },
                    },
                    ...{
                      minLength: {
                        value: 4,
                        message: `Value must be  equal to 4 characters.`,
                      },
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
                      type="number"
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
                  id="gender"
                  name="gender"
                  rules={Validations.REQUIRED}
                  defaultValue=""
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      margin="dense"
                      label="Gender"
                      select
                      fullWidth
                      variant="standard"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error?.message : null}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  endIcon={processing && <CircularProgress color="secondary" size={18} />}
                  disabled={processing}
                >
                  {processing ? 'Adding' : 'Add'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </PublicWrapper>
  );
};

export default AddProfile;
