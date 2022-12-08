/* eslint-disable prettier/prettier */
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
import ManageLaundryState from '../components/inventory/ManageLaundryState';

const DEVICE_ID = new uuid.DeviceUUID().get();

export const UserActionsContext = React.createContext({
  // eslint-disable-next-line prettier/prettier
  showUserActionDialog: () => {},
  // eslint-disable-next-line prettier/prettier
  closeDialog: () => {},
  setCurrentSocket: () => {},
  currentSocket: () => {},
  changeSocket: () => {},
  setChangeSocket: () => {},
});

export const UserActionsProvider = ({ children }) => {
  const { showSuccessToastr, showErrorToastr } = useToastr();
  const [currentSocket, setCurrentSocket] = useState('');
  const [changeSocket, setChangeSocket] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState(USER_ACTIONS.NA_ACTION_DETECTED);
  const [refreshStatsData, setRefreshStatsData] = useState(false);

  const [detectedClothes, setDetectedClothes] = useState([]);
  const [openManageLaundryStateDialog, setOpenManageLaundryStateDialog] = useState(false);

  const closeDialog = () => {
    setAction(USER_ACTIONS.NA_ACTION_DETECTED);
    setDetectedClothes([]);
    setRefreshStatsData((ps) => !ps);
    setIsOpen(false);
  };

  const showUserActionDialog = (userAction) => {
    setAction(userAction);
    setDetectedClothes([]);
    setIsOpen(true);
  };

  useEffect(() => {
    const ENDPOINT = '127.0.0.1:8000';
    const socket = socketIOClient(ENDPOINT);

    socket.on('connect', () => {
      socket.emit('connected', DEVICE_ID);
      setCurrentSocket('global-level');
    });
    // eslint-disable-next-line prettier/prettier
    socket.on('disconnect', () => {});

    socket.on('RFID scanned', async (d) => {
      if (d?.pkt_Type === RFID_PACKET_TYPE.TAKE_CLOTH) {
        // incase of multiple clothes taken from the closet, show appropiate number of clothes till 1min
        showSuccessToastr('Cloth has been taken from the closet.');
        setRefreshStatsData((ps) => !ps);
      }

      if (d?.pkt_Type === RFID_PACKET_TYPE.PUT_CLOTH) {
        let laundryState = LAUNDRY_STATE.NA;
        if (action === USER_ACTIONS.NA_ACTION_DETECTED) {
          setOpenManageLaundryStateDialog(true);
        }
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
      setCurrentSocket('');
    };
  }, [detectedClothes, action, isOpen, changeSocket]);

  const submitWashedClothInfo = async () => {
    try {
      await saveWashedClothesInfo(detectedClothes);
      showSuccessToastr('Clothes information updated successfully.');
      setDetectedClothes([]);
      closeDialog();
      // window.location.assign(RoutePaths.INVENTORY);
    } catch ({ response }) {
      showErrorToastr(
        response?.message ||
          // eslint-disable-next-line prettier/prettier
          response?.toString() ||
          'Error saving clothes information. Please scan again and confirm.'
      );
      // window.location.assign(RoutePaths.INVENTORY);
    }
  };

  return (
    <>
      <UserActionsContext.Provider
        value={{
          closeDialog,
          showUserActionDialog,
          setCurrentSocket,
          currentSocket,
          setChangeSocket,
          changeSocket,
          refreshStatsData,
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
      <ManageLaundryState
        open={openManageLaundryStateDialog}
        closeDialog={() => {
          setRefreshStatsData((ps) => !ps);
          setOpenManageLaundryStateDialog(false);
          setDetectedClothes([]);
        }}
        onConfirm={() => {
          setRefreshStatsData((ps) => !ps);
          setOpenManageLaundryStateDialog(false);
          setDetectedClothes([]);
        }}
        detectedClothes={detectedClothes}
      />
    </>
  );
};

UserActionsProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
