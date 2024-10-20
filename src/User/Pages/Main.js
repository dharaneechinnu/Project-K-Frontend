import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Home from '../Compontent/Home';
import Stage from '../Compontent/Stage';
import Progress from '../Compontent/Progress';
import UpComing from '../Compontent/UpComing';
import Footer from '../Compontent/Footer';
// import Read from '../Compontent/Read';

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to check if the user is in localStorage
    const checkUser = () => {
      const storedUser = localStorage.getItem('user'); // Assuming user data is stored under 'user'
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse and set user data
      } else {
        setUser(null); // Clear user state if not found
        navigate('/'); // Redirect to '/' if no user is found
      }
    };

    // Check every second (1000 milliseconds)
    const interval = setInterval(checkUser, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
        <>
          <Home />
          <Stage />
          <Progress />
          <UpComing />
          <Footer />
        </>
      
    </>
  );
};

export default Main;
