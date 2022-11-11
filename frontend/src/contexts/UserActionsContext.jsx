import React, { useState } from 'react';
import Proptypes from 'prop-types';
import { USER_ACTIONS } from '../configs';
import UserActionsDialog from '../components/inventory/UserActionsDialog';

export const UserActionsContext = React.createContext({
  showUserActionDialog: () => {},
  closeDialog: () => {},
});

export const UserActionsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState(USER_ACTIONS.NA_ACTION_DETECTED);

  // TODO: remove Later
  const detectedClothes = new Array(5).fill(undefined).map((c, i) => ({
    uID: i + 1,
    category: `Category ${i + 1}`,
    subCategory: `Sub Category ${i + 1}`,
    deviceID: i + 1,
  }));

  const closeDialog = () => {
    setIsOpen(false);
  };

  const showUserActionDialog = (userAction) => {
    setAction(userAction);
    setIsOpen(true);
  };

  return (
    <>
      <UserActionsContext.Provider
        value={{
          closeDialog,
          showUserActionDialog,
        }}
      >
        {children}
      </UserActionsContext.Provider>
      <UserActionsDialog
        open={isOpen}
        action={action}
        closeDialog={closeDialog}
        detectedClothes={detectedClothes}
      />
    </>
  );
};

UserActionsProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
