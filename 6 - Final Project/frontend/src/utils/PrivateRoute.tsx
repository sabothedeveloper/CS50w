import { Navigate } from 'react-router-dom';
import React, { useState, ReactNode, useContext } from 'react';
import AuthContext from './AuthProvider';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }): React.ReactElement => {
  let { user } = useContext(AuthContext);

  return !user ? <Navigate to='/login'/> : <>{children}</>;
};

export default PrivateRoute;