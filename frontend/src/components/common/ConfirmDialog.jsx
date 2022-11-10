import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

const ConfirmDialog = ({ title, message, onClose, confirmBtnText, onApprove, processing }) => (
  <Dialog open>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onApprove}
        autoFocus
        endIcon={processing && <CircularProgress size={25} />}
        disabled={processing}
        color="error"
        variant="contained"
      >
        {confirmBtnText}
      </Button>
      <Button onClick={onClose} variant="contained">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  confirmBtnText: PropTypes.string,
  processing: PropTypes.bool,
};

ConfirmDialog.defaultProps = {
  confirmBtnText: 'Delete',
  processing: false,
};
