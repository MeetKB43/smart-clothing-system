// Style for invoice form page
const Style = (theme) => ({
  itemsHeading: {
    marginBottom: 15,
    marginTop: 15,
  },
  addItemButton: {
    height: 'min-content',
  },
  formInput: {
    marginBottom: 15,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  topFormComponent: {
    marginRight: 20,
    width: 250,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  formBottomComponent: {
    marginTop: 10,
    marginBottom: 20,
    width: 250,
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
      marginRight: 0,
    },
  },
  errorText: {
    color: '#f44336',
  },
  orderFormtableData: {
    '& .MuiTableCell-root': {
      padding: '2px 6px !important',
      fontSize: 13,
    },
    '& .MuiTableHead-root': {},
    minWidth: 650,
  },
  disabledInput: {
    color: 'black !important',
    '& .Mui-disabled': {
      color: 'black',
      '-webkit-text-fill-color': 'black',
    },
  },
});

export default Style;
