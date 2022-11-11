import React from 'react';
import { UserActionsContext } from '../contexts/UserActionsContext';

export default function useUserActions() {
  return React.useContext(UserActionsContext);
}
