import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Pagination, IconButton } from '@mui/material';
import { deleteProfile, getProfilesList } from '../api/Profile';
import { PrivateWrapper } from '../components/layouts';
import TableListing from '../ui/styles/views/TableListing';
import { ConfirmDialog, TableLoader } from '../components/common';
import ManageProfileForm from '../components/profiles/ManageProfileForm';
import useToastr from '../hooks/useToastr';

const useStyles = makeStyles(TableListing);

const Profiles = () => {
  const pageName = 'Profiles';
  const classes = useStyles();
  const { showSuccessToastr, showErrorToastr } = useToastr();

  const [rows, setRows] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadRows, setReloadRows] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState('');

  const [selectedProfile, setSelectedProfile] = useState(0);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

  const columns = [
    { name: 'Name', id: 'name', width: '40%' },
    { name: 'Clothes', id: 'totalClothes', width: '40%', align: 'right' },
  ];

  const constructQuery = () => {
    let q = '1=1';
    if (searchText) q += `&searchText=${searchText}`;

    return q.substring(4);
  };

  useEffect(() => {
    setDataLoaded(false);
    getProfilesList(activePage, constructQuery())
      .then((data) => {
        setRows(data.map((d) => ({ ...d, name: d.username, totalClothes: 10 }))); // TODO: delete static data later
        setTotalPages(1);
        setDataLoaded(true);
      })
      .catch(() => {
        setRows([]);
        showErrorToastr('Error fetching data. Please refresh the page.');
        setDataLoaded(true);
      });
  }, [reloadRows, activePage]);

  const searchList = () => {
    setActivePage(1);
    setReloadRows(!reloadRows);
  };

  const deleteRecord = () => {
    deleteProfile(selectedProfile)
      .then(() => {
        setShowConfirmDeleteDialog(false);
        showSuccessToastr('Profile delted successfully.');
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
            <TextField
              name="search"
              id="search"
              label="Search"
              className={classes.searchInput}
              onChange={(e) => {
                setSearchText(e.target.value);
                searchList();
              }}
              value={searchText}
            />
            <Button
              variant="contained"
              className={classes.searchFilterBtn}
              onClick={() => setReloadRows(!reloadRows)}
            >
              Refresh
            </Button>
          </div>
          <div className={classes.filterRight}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.addNewBtn}
              onClick={() => setShowProfileForm(!showProfileForm)}
            >
              Add New
            </Button>
          </div>
        </div>
        <TableContainer>
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
                  <TableRow key={`profile-${row.id}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{row.totalClothes}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        className={classes.deleteBtn}
                        onClick={() => {
                          setShowConfirmDeleteDialog(true);
                          setSelectedProfile(row.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        className={classes.deleteBtn}
                        onClick={() => {
                          setShowProfileForm(true);
                          setSelectedProfile(row.id);
                        }}
                      >
                        <EditIcon fontSize="small" />
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

        {showProfileForm && (
          <ManageProfileForm
            closeDialog={() => {
              setReloadRows(!reloadRows);
              setSelectedProfile(null);
              setShowProfileForm(false);
            }}
            editId={selectedProfile}
          />
        )}

        {showConfirmDeleteDialog && (
          <ConfirmDialog
            title="Delete Profile"
            message="Do you want to delete this profile? This action can not be undone."
            onClose={() => {
              setSelectedProfile(null);
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

export default Profiles;
