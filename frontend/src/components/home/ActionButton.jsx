import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { USER_ACTIONS } from '../../configs';
import useUserActions from '../../hooks/useUserActions';

const ActionButton = ({ action }) => {
  const { showUserActionDialog } = useUserActions();

  const getActionTextValue = () => {
    switch (action) {
      case USER_ACTIONS.ADD_NEW_CLOTH:
        return 'Add new Cloth';
      case USER_ACTIONS.PUT_WASHED_CLOTH:
        return 'Add Washed Clothes';
      case USER_ACTIONS.PUT_UNWASHED_CLOTH:
        return 'Add Unwashed Clothes';
      case USER_ACTIONS.TAKE_CLOTH:
        return 'Take Clothes';
      default:
        return '';
    }
  };
  return (
    <Button
      color="primary"
      variant="contained"
      sx={{
        width: '100%',
        p: 1,
        py: 3,
        fontSize: 16,
        borderRadius: 1,
        mb: 1,
      }}
      onClick={() => {
        showUserActionDialog(action);
      }}
    >
      {getActionTextValue()}
    </Button>
  );
};

ActionButton.propTypes = {
  action: PropTypes.number.isRequired,
};

export default ActionButton;
