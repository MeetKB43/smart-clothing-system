import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Controller, useForm } from 'react-hook-form';
import { Dialog, MenuItem } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import * as uuid from 'device-uuid';
import useToastr from '../../hooks/useToastr';
import { addProfile } from '../../api/Profile';
import Validations from '../../utils';

const ManageProfileForm = ({ editId, closeDialog }) => {
  const { control, handleSubmit, reset } = useForm();
  const { showErrorToastr, showSuccessToastr } = useToastr();

  const [processing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const toSubmitData = {
        deviceID: new uuid.DeviceUUID().get(),
        username: `${data.firstName} ${data.lastName}`,
        firstname: data.firstName,
        lastname: data.lastName,
        age: data.age,
        gender: data.gender,
        email: data.email,
        city: data.city,
      };
      await addProfile(toSubmitData);
      showSuccessToastr('Added profile successfully.');
      closeDialog();
      setProcessing(false);
    } catch (error) {
      showErrorToastr('Error adding the profile.');
      reset({});
      setProcessing(false);
    }
  };

  return (
    <Dialog open>
      <DialogTitle>{editId ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
      <DialogContent>
        <form name="manage-profile" id="manage-profile" onSubmit={handleSubmit(onSubmit)}>
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
                id="email"
                name="email"
                rules={{ ...Validations.EMAIL_REQUIRED }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    id="email"
                    name="email"
                    label="Email Address"
                    fullWidth
                    variant="standard"
                    type="email"
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
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          form="manage-profile"
          variant="contained"
          type="submit"
          color="primary"
          endIcon={processing && <CircularProgress color="secondary" size={18} />}
          disabled={processing}
        >
          {processing ? 'Creating profile' : 'Create Profile'}
        </Button>
        <Button onClick={closeDialog} variant="contained" color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ManageProfileForm.propTypes = {
  editId: PropTypes.string.isRequired,
  closeDialog: PropTypes.func.isRequired,
};

export default ManageProfileForm;
