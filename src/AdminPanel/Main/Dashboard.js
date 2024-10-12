// Dashboard.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LeftPanel from './LeftPanel';
import MainContent from './MainContent';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('User Details');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('Admin-Token');
      if (!token) {
        // If no token is found, navigate to the login page
        navigate('/');
      }
    }, 1000); // Check every second (1000ms)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [navigate]);
  
  const handleLogout = () => {
   localStorage.removeItem('Admin-Token');
   localStorage.removeItem('Admin-user');

    navigate('/login');
  };

  return (
    <DashboardContainer>
      <LeftPanel activeSection={activeSection} setActiveSection={setActiveSection} handleLogout={handleLogout} />
      <MainContent activeSection={activeSection} />
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  font-family: 'Arial', sans-serif;
  color: #333;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

export default Dashboard;
