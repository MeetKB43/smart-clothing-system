import React, { useState, useEffect } from 'react';
import Proptypes from 'prop-types';
import * as uuid from 'device-uuid';
import socketIOClient from 'socket.io-client';
import {
  getCategoryName,
  getSubCategoryName,
  LAUNDRY_STATE,
  RFID_PACKET_TYPE,
  USER_ACTIONS,
} from '../configs';
import UserActionsDialog from '../components/inventory/UserActionsDialog';
import useToastr from '../hooks/useToastr';
import { saveWashedClothesInfo } from '../api/Clothes';

const DEVICE_ID = new uuid.DeviceUUID().get();

export const UserActionsContext = React.createContext({
  showUserActionDialog: () => {},
  closeDialog: () => {},
});

export const UserActionsProvider = ({ children }) => {
  const { showSuccessToastr, showErrorToastr } = useToastr();
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState(USER_ACTIONS.NA_ACTION_DETECTED);
  const [takenClothes, setTakenClothes] = useState(0);
  const [detectedClothes, setDetectedClothes] = useState([]);

  const closeDialog = () => {
    setDetectedClothes([]);
    setIsOpen(false);
  };

  const showUserActionDialog = (userAction) => {
    setAction(userAction);
    setIsOpen(true);
  };

  useEffect(() => {
    const ENDPOINT = '127.0.0.1:8000';
    const socket = socketIOClient(ENDPOINT);

    socket.on('connect', () => {
      socket.emit('connected', DEVICE_ID);
    });

    socket.on('disconnect', () => {});

    socket.on('RFID scanned', async (d) => {
      if (d?.pkt_Type === RFID_PACKET_TYPE.TAKE_CLOTH) {
        // incase of multiple clothes taken from the closet, show appropiate number of clothes till 1min
        showSuccessToastr(
          takenClothes > 1
            ? `${takenClothes} Clothes has been taken from the closet.`
            : 'Cloth has been taken from the closet.'
        );
        setTakenClothes((ps) => ps + 1);
        setDetectedClothes((ps) => {
          const arrCpy = [...ps];

          arrCpy.push({
            RFID: d?.RFID,
            deviceID: DEVICE_ID,
            category: getCategoryName(d?.cType),
            subCategory: getSubCategoryName(d?.cType, d?.cSubType),
          });

          return arrCpy;
        });
        // Remove taken cloth buffer value after 1min
        setTimeout(() => {
          setTakenClothes(0);
          setDetectedClothes([]);
        }, 60000);
      }

      if (d?.pkt_Type === RFID_PACKET_TYPE.PUT_CLOTH) {
        let laundryState = LAUNDRY_STATE.NA;
        if (action === USER_ACTIONS.PUT_WASHED_CLOTH) laundryState = LAUNDRY_STATE.WASHED;
        if (action === USER_ACTIONS.PUT_UNWASHED_CLOTH) laundryState = LAUNDRY_STATE.UNWASHED;

        setDetectedClothes((ps) => {
          const arrCpy = [...ps];

          arrCpy.push({
            RFID: d?.RFID,
            deviceID: DEVICE_ID,
            laundryState,
            category: getCategoryName(d?.cType),
            subCategory: getSubCategoryName(d?.cType, d?.cSubType),
          });

          return arrCpy;
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [takenClothes, detectedClothes, action]);

  const submitWashedClothInfo = async () => {
    try {
      await saveWashedClothesInfo(detectedClothes);
      showSuccessToastr('Clothes information updated successfully.');
      setDetectedClothes([]);
      closeDialog();
    } catch ({ response }) {
      showErrorToastr(
        response?.message ||
          response?.toString() ||
          'Error saving clothes information. Please scan again and confirm.'
      );
    }
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
        onConfirm={action === USER_ACTIONS.PUT_WASHED_CLOTH ? submitWashedClothInfo : closeDialog}
        detectedClothes={detectedClothes}
      />
    </>
  );
};

UserActionsProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
