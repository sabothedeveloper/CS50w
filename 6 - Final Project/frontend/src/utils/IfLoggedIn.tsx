import { Navigate } from 'react-router-dom';
import React, { useState, ReactNode, useContext } from 'react';
import AuthContext from './AuthProvider';

interface IfNotLoggedInProps {
  children: ReactNode;
}

const IfNotLoggedIn: React.FC<IfNotLoggedInProps> = ({ children, ...rest }): React.ReactElement => {
  let { user } = useContext(AuthContext);

  return user ? <Navigate to='/'/> : <>{children}</>;
};

export default IfNotLoggedIn;