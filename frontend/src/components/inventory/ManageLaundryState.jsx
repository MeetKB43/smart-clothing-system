/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import CheckBox from '@mui/material/CheckBox';
import { saveClothesInfo } from '../../api/Clothes';
import useToastr from '../../hooks/useToastr';
// import { RoutePaths } from '../../configs';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ManageLaundryState = ({ closeDialog, open, detectedClothes, onConfirm }) => {
  const [finalClothData, setFinalClothData] = useState([]);
  const [isAllWashed, setIsAllWashed] = useState(false);
  const { showSuccessToastr, showErrorToastr } = useToastr();

  const handleToggle = (row, e) => {
    setFinalClothData((ps) => {
      const cpyArr = [...ps];
      const idx = cpyArr.map((c) => c.RFID).indexOf(row.RFID);
      if (idx !== -1) {
        cpyArr[idx].isWashed = e.target.checked;
      }
      return cpyArr;
    });
  };

  useEffect(() => {
    setFinalClothData((ps) => {
      const cpyArr = [...ps];
      for (let index = 0; index < detectedClothes.length; index++) {
        const detectedCloth = detectedClothes[index];
        if (!cpyArr.map((c) => c.RFID).includes(detectedCloth.RFID)) {
          cpyArr.push({ ...detectedCloth, isWashed: false });
        }
      }
      return cpyArr;
    });
  }, [detectedClothes]);

  useEffect(() => {
    const anyUnWashed = finalClothData.map((d) => d.isWashed).includes(false);
    setIsAllWashed(!anyUnWashed);
  }, [finalClothData]);

  const onAllWashedChange = (e) => {
    if (e.target.checked) {
      setFinalClothData((ps) => {
        const cpyArr = [...ps];
        for (let index = 0; index < cpyArr.length; index++) {
          cpyArr[index].isWashed = true;
        }
        return cpyArr;
      });
    } else {
      setFinalClothData((ps) => {
        const cpyArr = [...ps];
        for (let index = 0; index < cpyArr.length; index++) {
          cpyArr[index].isWashed = false;
        }
        return cpyArr;
      });
    }
  };

  const submitClothLaundryInfo = async () => {
    try {
      await saveClothesInfo(finalClothData);
      showSuccessToastr('Clothes information updated successfully.');
      onConfirm();
      setFinalClothData([]);
      closeDialog();
      // window.location.assign(RoutePaths.INVENTORY);
    } catch ({ response }) {
      setFinalClothData([]);
      // window.location.assign(RoutePaths.INVENTORY);
      showErrorToastr(
        response?.message ||
        // eslint-disable-next-line prettier/prettier
        response?.toString() ||
        'Error saving clothes information. Please scan again and confirm.'
      );
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        fullScreen
        onClose={() => {
          setFinalClothData([]);
          closeDialog();
        }}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Detected Clothes
            </Typography>
            <Button autoFocus color="secondary" onClick={submitClothLaundryInfo}>
              Confirm
            </Button>
          </Toolbar>
        </AppBar>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {['Cloth', 'Washed'].map((col, index) => (
                  <TableCell align={index >= 1 ? 'right' : 'left'}>
                    {index === 1 && (
                      <CheckBox
                        sx={{ mr: 0.1 }}
                        edge="end"
                        checked={isAllWashed}
                        onChange={(e) => {
                          onAllWashedChange(e);
                        }}
                      />
                    )}
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {finalClothData.map((row) => (
                <TableRow key={`ads-${row.id}`}>
                  <TableCell>
                    {row.category} {row.subCategory}
                  </TableCell>
                  <TableCell align="right">
                    <CheckBox
                      edge="end"
                      checked={row.isWashed}
                      onChange={(e) => {
                        handleToggle(row, e);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </div>
  );
};

ManageLaundryState.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  detectedClothes: PropTypes.arrayOf(
    PropTypes.shape({
      RFID: PropTypes.number.isRequired,
      uID: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      subCategory: PropTypes.string.isRequired,
      deviceID: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ManageLaundryState;
