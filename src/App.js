import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Main from './pages/Main';
import Login from './Compoents/Login'; // Assuming you have a Login component
import SignUp from './Compoents/SignUp';
import Dashboard from './AdminPanel/Main/Dashboard';
import User from './User/Pages/Main';
import ForgotPassword from './Compoents/Forgotpassword';
import Reset from './Compoents/Reset';
import OTPVerification from './Compoents/OTPVerification';
import YogoForm from './User/Compontent/YogoForm';
import AdminAddQuestion from './AdminPanel/Compontent/AdminAddQuestion';
import AdminLogin from './AdminPanel/Compontent/AdminLogin';


function App() {
  return (
    <Router>
      <Routes>


        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/UserPanel" element={<User />} />
        <Route path="/yogoform/:courseId" element={<YogoForm />} /> {/* Fixed 'component' to 'element' */}
        <Route path="/yogoform" element={<YogoForm />} />


    
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<Reset />} />
        <Route path="/OTPVerification" element={<OTPVerification />} />


        <Route path="/DashBoard" element={<Dashboard />} />
        <Route path="/AdminPanel" element={<AdminAddQuestion />} />
        <Route path="/adminlogin" element={<AdminLogin />} />



      </Routes>
    </Router>
  );
}

export default App;
