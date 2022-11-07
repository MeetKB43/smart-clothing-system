import React, { useState } from 'react';
import Proptypes from 'prop-types';
import Toastr from '../components/common/Toastr';

export const ToastrContext = React.createContext({
  showErrorToastr: () => {},
  showSuccessToastr: () => {},
  closeToastr: () => {},
});

export const ToastrProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  const closeToastr = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMessage('');
    }, 500);
  };

  const showErrorToastr = (msg) => {
    setMessage(msg);
    setType('error');
    setIsOpen(true);
  };

  const showSuccessToastr = (msg) => {
    setMessage(msg);
    setType('success');
    setIsOpen(true);
  };

  return (
    <>
      <ToastrContext.Provider
        value={{
          showErrorToastr,
          showSuccessToastr,
          closeToastr,
        }}
      >
        {children}
      </ToastrContext.Provider>
      <Toastr isOpen={isOpen} message={message} type={type} closeToastr={closeToastr} />
    </>
  );
};

ToastrProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
