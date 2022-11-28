import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RoutePaths } from './configs';
import {
  LoginPage,
  ForgotPasswordPage,
  NotFoundPage,
  LogoutPage,
  HomePage,
  ResetPasswordPage,
  SignupPage,
  InventoryPage,
  ProfilesPage,
  SuggestionsPage,
  UserInventoryPage,
} from './views';
import { ToastrProvider } from './contexts/ToastrContext';
import './assets/styles/fonts.css';
import AppThemeProvider from './contexts/ThemeContext';
import { validateSession } from './api/Auth';
import { UserActionsProvider } from './contexts/UserActionsContext';

const App = () => {
  useEffect(async () => {
    try {
      const result = await validateSession();
      if (result.success) {
        window.localStorage.setItem('isLoggedIn', true);
      } else {
        // DO SOMETHING
      }
    } catch {
      // DO SOMETHING
    }
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <AppThemeProvider>
        <CssBaseline />
        <ToastrProvider>
          <UserActionsProvider>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <Router>
                <Switch>
                  <Route exact path={RoutePaths.HOME} component={HomePage} />
                  <Route exact path={RoutePaths.SIGN_UP} component={SignupPage} />
                  <Route exact path={RoutePaths.LOGIN} component={LoginPage} />
                  <Route exact path={RoutePaths.FORGOT_PASSWORD} component={ForgotPasswordPage} />
                  <Route exact path={RoutePaths.RESET_PASSWORD} component={ResetPasswordPage} />
                  <Route exact path={RoutePaths.LOGOUT} component={LogoutPage} />
                  <Route exact path={RoutePaths.INVENTORY} component={InventoryPage} />
                  <Route exact path={RoutePaths.SUGGESTIONS} component={SuggestionsPage} />
                  <Route exact path={RoutePaths.PROFILES} component={ProfilesPage} />
                  <Route exact path={RoutePaths.USER_INVENTORY} component={UserInventoryPage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </Router>
            </GoogleOAuthProvider>
          </UserActionsProvider>
        </ToastrProvider>
      </AppThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
