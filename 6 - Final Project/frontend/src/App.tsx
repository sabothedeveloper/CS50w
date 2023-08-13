import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, redirect, HashRouter} from "react-router-dom";
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Index from './components/Index';
import PrivateRoute from './utils/PrivateRoute';
import IfNotLoggedIn from './utils/IfLoggedIn';
import Profile from './components/Profile';
import axios from 'axios';
import { AuthProvider } from './utils/AuthProvider';

// axios.defaults.withCredentials = true; // even for get requests if
//                                     // demand session authentication
// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'x-csrftoken'

function App() {
  return (
    <BrowserRouter>
    <div className='min-vh-100'>
      <AuthProvider>
        <Navbar></Navbar>
        <Routes>
          {/* default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* IfNotLoggedIn = Accessable IfNotLoggedIn */}
            <Route path="/login" element={<IfNotLoggedIn><LogIn/></IfNotLoggedIn>}></Route>
            <Route path="/register" element={<IfNotLoggedIn><SignUp/></IfNotLoggedIn>}></Route>

            {/* PrivateRoute = Accessable if logged in */}
            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}></Route>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>} />
          
        </Routes>
      </AuthProvider>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
