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
import { getProfilesList } from '../../api/Profile';
import { addNewCloth } from '../../api/Clothes';
import useToastr from '../../hooks/useToastr';
import { ClothCategories } from '../../configs';

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
      {dataList.map((c) => (
        <Grid item xs={12} md={6}>
          <ListItemButton
            onClick={() => {
              setSelectedData(c.id);
              setActiveStep((ps) => ps + 1);
            }}
            alignItems="center"
          >
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
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

  const [activeStep, setActiveStep] = useState(STEPS.CATEGORY_SELECTION);
  const [processing, setProcessing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    setSubCategories(
      ClothCategories.filter((c) => c.id === selectedCategory).map((c) => c.subCategories)
    );
  }, [selectedCategory]);

  // eslint-disable-next-line no-unused-vars
  function getStepContent(step) {
    switch (step) {
      // case 0:
      //   return <ProfileSelection setActiveStep={setActiveStep} />;
      case STEPS.CATEGORY_SELECTION:
        return (
          <ClothDataSelection
            setActiveStep={setActiveStep}
            setSelectedData={setSelectedCategory}
            dataList={ClothCategories}
          />
        );
      case STEPS.SUB_CAT_SELECTION:
        return (
          <ClothDataSelection
            setActiveStep={setActiveStep}
            setSelectedData={setSelectedSubCategory}
            dataList={subCategories}
          />
        );
      case STEPS.ATTACH_TAG:
        return <AttachTag />;
      case STEPS.FINAL_MSG:
        return <FinalStep processing={processing} />;
      default:
        return <Typography variant="h6">Something went wrong.</Typography>;
    }
  }

  // const labels = ['Select Profile', 'Select Cloth Category', 'Attach RFID', 'Done'];
  const labels = ['Select Cloth Category', 'Select Cloth Sub Category', 'Attach RFID', 'Done'];

  const addClothToSystem = (data) => {
    setProcessing(true);
    addNewCloth(data)
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
      // connected
    });

    socket.on('disconnect', () => {
      // disconnected
    });

    socket.on('RFID scanned', async (d) => {
      if (d[0] === 'Cloth Scanned') {
        addClothToSystem({
          RFID: d[2],
          uID: selectedProfile,
          cType: selectedCategory,
          subCatType: selectedSubCategory,
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

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
              dataList={ClothCategories.filter((c) => c.id === selectedCategory).map(
                (c) => c.subCategories
              )}
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
        {activeStep > 0 && (
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
        )}
        <Button onClick={closeDialog} variant="contained" color="secondary">
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
