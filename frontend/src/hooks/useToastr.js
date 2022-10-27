import React from 'react';
import { ToastrContext } from '../contexts/ToastrContext';

export default function useToastr() {
  return React.useContext(ToastrContext);
}
