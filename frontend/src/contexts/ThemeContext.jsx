import React, { useState, useEffect } from 'react';
import { useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material';
import Proptypes from 'prop-types';
import themes from '../ui/Theme';

export default function AppThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [themeOverridden] = useState(false);

  // Infer theme based on system settings
  const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });

  // Update theme when system settings change
  useEffect(() => {
    if (themeOverridden) return;
    setTheme(prefersDarkTheme ? 'dark' : 'light');
  }, [prefersDarkTheme, themeOverridden, setTheme]);

  // Sync theme to body data-theme attribute for Feedback Fin
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={theme === 'dark' ? themes.light() : themes.light()}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

AppThemeProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
