import React, { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import ProfileSelection from './ProfileSelection';
import ClothCategorySelection from './ClothCategorySelection';
import FinalStep from './FinalStep';

const AddClothForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <ProfileSelection setActiveStep={setActiveStep} />;
      case 1:
        return <ClothCategorySelection setActiveStep={setActiveStep} />;
      case 2:
        return <FinalStep />;
      default:
        return <Typography variant="h6">Something went wrong.</Typography>;
    }
  }

  const labels = ['Select Profile', 'Select Cloth Category', 'Done'];

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
