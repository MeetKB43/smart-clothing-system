import React from 'react';
import Proptypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Toastr = ({ isOpen, message, type, closeToastr, duration }) => (
  <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    open={isOpen}
    autoHideDuration={duration}
    onClose={closeToastr}
  >
    <Alert severity={type} variant="filled">
      {message}
    </Alert>
  </Snackbar>
);

Toastr.defaultProps = {
  duration: 3000,
};

Toastr.propTypes = {
  isOpen: Proptypes.bool.isRequired,
  message: Proptypes.bool.isRequired,
  type: Proptypes.bool.isRequired,
  closeToastr: Proptypes.bool.isRequired,
  duration: Proptypes.number,
};
export default Toastr;
