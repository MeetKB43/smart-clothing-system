import React, { useState, useEffect } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import socketIOClient from 'socket.io-client';
import ProfileSelection from './ProfileSelection';
import ClothCategorySelection from './ClothCategorySelection';
import AttachTag from './AttachTag';
import FinalStep from './FinalStep';
import { addNewCloth } from '../../api/Clothes';
import useToastr from '../../hooks/useToastr';

const AddClothForm = () => {
  const { showErrorToastr } = useToastr();

  const [activeStep, setActiveStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <ProfileSelection setActiveStep={setActiveStep} />;
      case 1:
        return <ClothCategorySelection setActiveStep={setActiveStep} />;
      case 2:
        return <AttachTag />;
      case 3:
        return <FinalStep processing={processing} />;
      default:
        return <Typography variant="h6">Something went wrong.</Typography>;
    }
  }

  const labels = ['Select Profile', 'Select Cloth Category', 'Attach RFID', 'Done'];

  const addClothToSystem = () => {
    setProcessing(true);
    addNewCloth()
      .then(() => {
        setActiveStep(3);
        setProcessing(false);
      })
      .catch((error) => {
        showErrorToastr(
          error?.response?.data?.message || error?.message || 'Something went wrong.'
        );
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
        await addClothToSystem();
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  return (
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
      <div>{getStepContent(activeStep)}</div>
      {activeStep >= 1 ||
        (activeStep === labels.length - 1 && (
          <Button
            onClick={() => {
              setActiveStep((ps) => ps - 1);
            }}
            sx={{ backgroundColor: 'text.secondary' }}
            variant="contained"
            disableElevation
          >
            Back
          </Button>
        ))}
    </Box>
  );
};

export default AddClothForm;
