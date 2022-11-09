import red from '@mui/material/colors/red';
import green from '@mui/material/colors/green';
import yellow from '@mui/material/colors/yellow';
import grey from '@mui/material/colors/grey';

const Style = (theme) => ({
  filterToolbar: {
    display: 'flex',
    marginTop: 20,
    marginBottom: 10,
  },
  filterLeft: {
    width: '80%',
    float: 'left',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  filterRight: {
    width: '30%',
    float: 'left',
    justifyContent: 'flex-end',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  searchInput: {
    '& .MuiInputBase-root': {
      marginTop: 0,
    },
    '& .MuiFormLabel-root': {
      top: -20,
    },
  },
  searchFilterBtn: {
    marginLeft: 10,
    minHeight: 36,
    marginTop: 22,
    padding: '3px 10px',
    boxShadow: 'none',
    '&:active': {
      boxShadow: 'none',
    },
    '&:focus': {
      boxShadow: 'none',
    },
    '&:hover': {
      boxShadow: 'none',
    },
  },
  addNewBtn: {
    minHeight: 36,
    marginLeft: 8,
    padding: '3px 16px',
    boxShadow: 'none',
    '&:active': {
      boxShadow: 'none',
    },
    '&:focus': {
      boxShadow: 'none',
    },
    '&:hover': {
      boxShadow: 'none',
    },
  },
  tableData: {
    width: '100%',
    '& .MuiTableCell-root': {
      padding: 8,
      fontSize: '0.9rem',
    },
    '& .MuiTableHead-root': {
      backgroundColor: grey[100],
    },
  },
  tablePagination: {
    marginTop: 20,
    marginBottom: 20,
  },
  statusActive: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: green[600],
    color: 'white',
  },
  statusPending: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: yellow[500],
    color: 'black',
  },
  statusInactive: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: red[500],
    color: 'white',
  },
  deleteBtn: {
    padding: 8,
  },
  editBtn: {
    padding: 8,
    marginRight: 5,
  },
  noRecordFoundText: {
    color: 'red',
    padding: '2rem !important',
    fontSize: '1rem !important',
  },
});

export default Style;
