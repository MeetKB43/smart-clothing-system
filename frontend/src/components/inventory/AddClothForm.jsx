/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import socketIOClient from 'socket.io-client';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as uuid from 'device-uuid';
import { getProfilesList } from '../../api/Profile';
import { addNewCloth } from '../../api/Clothes';
import useToastr from '../../hooks/useToastr';
import { ClothCategories, RFID_PACKET_TYPE } from '../../configs';
import useUserActions from '../../hooks/useUserActions';

const DEVICE_ID = new uuid.DeviceUUID().get();

const ProfileSelection = ({ setActiveStep }) => {
  const { showErrorToastr } = useToastr();
  const [profiles, setProfiles] = useState([]);

  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    setProcessing(true);
    getProfilesList()
      .then((res) => {
        setProfiles(res);
        setProcessing(false);
      })
      .catch(({ response }) => {
        showErrorToastr(response?.data?.message || response?.data || 'Something went wrong.');
        setProcessing(false);
      });
  }, []);

  if (processing) {
    return (
      <Box p={5} display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={25} />
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        {profiles.map((p) => (
          <Grid key={p.uID} item xs={12} md={6}>
            <ListItemButton onClick={() => setActiveStep(1)} alignItems="center">
              <ListItemAvatar>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemAvatar>
              <ListItemText primary={p.username} />
            </ListItemButton>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

ProfileSelection.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
};

const FinalStep = ({ processing }) => (
  <Box display="flex" sx={{ my: 4 }} flexDirection="column">
    {processing
      ? 'Scanned cloth successfuly. Please wait while we add it into our system'
      : 'Your Cloth has been added into the system successfully.'}
  </Box>
);

FinalStep.propTypes = {
  processing: PropTypes.bool.isRequired,
};

const ClothDataSelection = ({ setActiveStep, dataList, setSelectedData }) => (
  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
    <Grid container spacing={2}>
      {dataList?.map((c) => (
        <Grid item xs={12} md={6}>
          <ListItemButton
            onClick={() => {
              setSelectedData(c.id);
              setActiveStep((ps) => ps + 1);
            }}
            alignItems="center"
          >
            <ListItemAvatar>
              <Avatar style={{ dropShadow: '5px 0 0 black' }} alt="Travis Howard" src={c.image} />
            </ListItemAvatar>
            <ListItemText primary={c.name} />
          </ListItemButton>
        </Grid>
      ))}
    </Grid>
  </List>
);

ClothDataSelection.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
  dataList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedData: PropTypes.func.isRequired,
};

const AttachTag = () => (
  <Box display="flex" sx={{ my: 4 }} flexDirection="column">
    Please attach your RFID tag to cloth and place it infront of the scanner to add the cloth.
  </Box>
);

const AddClothForm = ({ closeDialog, selectedProfile }) => {
  const STEPS = {
    CATEGORY_SELECTION: 0,
    SUB_CAT_SELECTION: 1,
    ATTACH_TAG: 2,
    FINAL_MSG: 3,
  };

  const { showErrorToastr } = useToastr();
  const { setCurrentSocket, setChangeSocket, changeSocket } = useUserActions();
  const [activeStep, setActiveStep] = useState(STEPS.CATEGORY_SELECTION);
  const [processing, setProcessing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const arr = ClothCategories.filter((c) => c.id === selectedCategory)[0]?.subCategories;
    setSubCategories(arr);
  }, [selectedCategory]);

  // const labels = ['Select Profile', 'Select Cloth Category', 'Attach RFID', 'Done'];
  const labels = ['Select Cloth Category', 'Select Cloth Sub Category', 'Attach RFID', 'Done'];

  const addClothToSystem = (rfid) => {
    setProcessing(true);

    if (!selectedCategory || !selectedSubCategory) {
      showErrorToastr('Cloth data required to add new clothes.');
      return;
    }

    addNewCloth({
      RFID: rfid,
      uID: selectedProfile,
      cType: selectedCategory,
      cSubType: selectedSubCategory,
      deviceID: DEVICE_ID,
    })
      .then(() => {
        setActiveStep(STEPS.FINAL_MSG);
        setProcessing(false);
      })
      .catch(({ response }) => {
        showErrorToastr(response?.data?.message || response?.data || 'Something went wrong.');
        setProcessing(false);
      });
  };

  useEffect(() => {
    const ENDPOINT = '127.0.0.1:8000';
    const socket = socketIOClient(ENDPOINT);
    socket.on('connect', () => {
      socket.emit('connected', DEVICE_ID);
      setCurrentSocket('form-level');
    });

    socket.on('disconnect', () => {});

    socket.on('RFID scanned', async (d) => {
      if (d?.pkt_Type === RFID_PACKET_TYPE.ADD_NEW_CLOTH) {
        addClothToSystem(d?.RFID);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setCurrentSocket('');
    };
  }, [selectedSubCategory]);

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>Add new cloth</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          maxWidth="800px"
          align="center"
          justifyContent="center"
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {labels.map((label) => {
              const labelProps = {};
              if (activeStep === -1) {
                labelProps.error = true;
              }
              return (
                <Step key={label}>
                  <StepLabel {...labelProps}>
                    {label}
                    <br />
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === STEPS.CATEGORY_SELECTION && (
            <ClothDataSelection
              setActiveStep={setActiveStep}
              setSelectedData={setSelectedCategory}
              dataList={ClothCategories}
            />
          )}
          {activeStep === STEPS.SUB_CAT_SELECTION && (
            <ClothDataSelection
              setActiveStep={setActiveStep}
              setSelectedData={setSelectedSubCategory}
              dataList={subCategories}
            />
          )}
          {activeStep === STEPS.ATTACH_TAG && <AttachTag />}
          {activeStep === STEPS.FINAL_MSG && <FinalStep processing={processing} />}
          {!Object.values(STEPS).includes(activeStep) && (
            <Typography variant="h6">Something went wrong.</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {activeStep > 0 ||
          (activeStep === labels.length - 1 && (
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                setActiveStep((ps) => ps - 1);
              }}
              color="primary"
              endIcon={processing && <CircularProgress color="secondary" size={18} />}
              disabled={processing}
            >
              {processing ? 'Processing' : 'Back'}
            </Button>
          ))}
        <Button
          onClick={() => {
            closeDialog();
            setChangeSocket(!changeSocket);
          }}
          variant="contained"
          color="secondary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddClothForm.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  selectedProfile: PropTypes.number.isRequired,
};

export default AddClothForm;
