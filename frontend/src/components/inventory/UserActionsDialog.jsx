import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { USER_ACTIONS } from '../../configs';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const UserActionsDialog = ({ action, closeDialog, open, detectedClothes, onConfirm }) => (
  <div>
    <Dialog open={open} fullScreen onClose={closeDialog} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {action === USER_ACTIONS.PUT_WASHED_CLOTH && 'List of washed clothes'}
            {action === USER_ACTIONS.PUT_UNWASHED_CLOTH && 'List of unwashed clothes'}
            {action === USER_ACTIONS.TAKE_CLOTH && 'List of taken clothes'}
            {action === USER_ACTIONS.NA_ACTION_DETECTED &&
              'List of unindentified status of clothes '}
          </Typography>
          <Button autoFocus color="secondary" onClick={onConfirm}>
            Confirm
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        {detectedClothes.map((c) => (
          <>
            <ListItem button>
              <ListItemText primary={c.category} secondary={c.subCategory} />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Dialog>
  </div>
);

UserActionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  action: PropTypes.string.isRequired,
  closeDialog: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  detectedClothes: PropTypes.arrayOf(
    PropTypes.shape({
      uID: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      subCategory: PropTypes.string.isRequired,
      deviceID: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default UserActionsDialog;
