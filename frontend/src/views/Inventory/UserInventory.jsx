import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconButton, Pagination } from '@mui/material';
import * as uuid from 'device-uuid';
import { PrivateWrapper } from '../../components/layouts';
import TableListing from '../../ui/styles/views/TableListing';
import { ConfirmDialog, TableLoader } from '../../components/common';
import AddClothForm from '../../components/inventory/AddClothForm';
import useToastr from '../../hooks/useToastr';
import { deleteCloth, getUserInventoryList } from '../../api/Clothes';
import useUserActions from '../../hooks/useUserActions';
import { getCategoryName, getSubCategoryName, USER_ACTIONS } from '../../configs';

const useStyles = makeStyles(TableListing);

const DEVICE_ID = new uuid.DeviceUUID().get();

const UserInventory = ({ match }) => {
  const uID = Number(match.params.uID) || 0;
  const pageName = 'User Inventory';
  const classes = useStyles();

  const { showSuccessToastr, showErrorToastr } = useToastr();
  const { showUserActionDialog } = useUserActions();

  const [rows, setRows] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadRows, setReloadRows] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedCloth, setSelectedCloth] = useState(0);
  const [showClothForm, setShowClothForm] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

  const columns = [
    { name: 'Category', id: 'name' },
    { name: 'Sub Category', id: 'totalClothes' },
  ];

  useEffect(() => {
    setDataLoaded(false);

    getUserInventoryList({ uID, deviceID: DEVICE_ID, page: 0 })
      .then((data) => {
        setRows(data?.results || []);
        setTotalPages(data?.pagination?.totalPages || 1);
        setDataLoaded(true);
      })
      .catch(() => {
        setRows([]);
        showErrorToastr('Error fetching data. Please refresh the page.');
        setDataLoaded(true);
      });
  }, [reloadRows]);

  const deleteRecord = () => {
    deleteCloth({ RFID: selectedCloth })
      .then(() => {
        setShowConfirmDeleteDialog(false);
        showSuccessToastr('Cloth deleted successfully.');
        setReloadRows(!reloadRows);
      })
      .catch((error) => {
        showErrorToastr(error?.message || 'Error deleting the profile. Please try again.');
        setShowConfirmDeleteDialog(false);
        setReloadRows(!reloadRows);
      });
  };

  return (
    <PrivateWrapper pageName={pageName}>
      <>
        <div className={classes.filterToolbar}>
          <div className={classes.filterLeft}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addNewBtn}
              onClick={() => showUserActionDialog(USER_ACTIONS.PUT_WASHED_CLOTH)}
            >
              Add Washed Clothes
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.addNewBtn}
              onClick={() => showUserActionDialog(USER_ACTIONS.PUT_UNWASHED_CLOTH)}
            >
              Add Unwashed Clothes
            </Button>
          </div>
          <div className={classes.filterRight}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addNewBtn}
              onClick={() => setShowClothForm(!showClothForm)}
            >
              Add New Cloth
            </Button>
          </div>
        </div>
        <TableContainer sx={{ mt: 2 }}>
          <Table className={classes.tableData} aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell width={col.width} align={col.align || 'left'} key={`col-${col.id}`}>
                    <span>{col.name}</span>
                  </TableCell>
                ))}
                <TableCell align="right" width="15%">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!dataLoaded && <TableLoader cols={3} />}
              {dataLoaded && rows.length === 0 && (
                <TableCell
                  align="center"
                  size="medium"
                  colSpan={6}
                  className={classes.noRecordFoundText}
                >
                  No records found
                </TableCell>
              )}
              {dataLoaded &&
                rows.map((row) => (
                  <TableRow key={`clothes-${row.RFID}`}>
                    <TableCell>{getCategoryName(row.cType)}</TableCell>
                    <TableCell>{getSubCategoryName(row.cType, row.cSubType)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        className={classes.deleteBtn}
                        onClick={() => {
                          setShowConfirmDeleteDialog(true);
                          setSelectedCloth(row.RFID);
                        }}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {dataLoaded && totalPages > 1 && (
          <Pagination
            count={totalPages}
            showFirstButton
            showLastButton
            className={classes.tablePagination}
            onChange={(_, pageNumber) => {
              setActivePage(pageNumber);
              setReloadRows(!reloadRows);
            }}
            page={activePage}
          />
        )}
        {showClothForm && (
          <AddClothForm
            selectedProfile={uID}
            closeDialog={() => {
              setReloadRows(!reloadRows);
              setSelectedCloth(null);
              setShowClothForm(false);
            }}
          />
        )}

        {showConfirmDeleteDialog && (
          <ConfirmDialog
            title="Delete Cloth"
            message="Do you want to delete this cloth item? This action can not be undone."
            onClose={() => {
              setSelectedCloth(null);
              setShowConfirmDeleteDialog(false);
              setReloadRows(!reloadRows);
            }}
            onApprove={deleteRecord}
          />
        )}
      </>
    </PrivateWrapper>
  );
};

UserInventory.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uID: PropTypes.number,
    }),
  }),
};

UserInventory.defaultProps = {
  match: {
    params: {
      uID: 0,
    },
  },
};

export default UserInventory;
