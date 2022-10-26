import { createTheme } from '@mui/material/styles';
import palette from './Palette';
import typography from './Fonts';

// Extend default MuiTheme
const Default = createTheme({
  palette,
  typography,
  components: {
    MuiFormHelperText: {
      contained: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    MuiButton: {
      root: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:focus': {
          boxShadow: 'none',
        },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:focus': {
          boxShadow: 'none',
        },
      },
    },
    MuiTableSortLabel: {
      icon: {
        opacity: 1,
        color: 'rgba(0, 0, 0, 0.54)',
      },
    },
  },
});

export default Default;
