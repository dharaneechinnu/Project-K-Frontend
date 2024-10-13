import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import Api from '../../Api/Api';

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserResponses, setSelectedUserResponses] = useState(null);
  const [loadingResponses, setLoadingResponses] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('Admin-Token');
        if (!token) {
          setError('No token found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await Api.get('/Admin/alluser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserDetails(response.data);
        setFilteredUserDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user details', err);
        setError('Failed to load user details.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredUserDetails(userDetails);
    } else {
      const filtered = userDetails.filter((user) => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.studentId.toString().includes(term) ||
        (user.batchno && user.batchno.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredUserDetails(filtered);
    }
  };

  const handleViewResponses = async (studentId) => {
    setLoadingResponses(true);
    try {
      const token = localStorage.getItem('Admin-Token');
      const response = await Api.get(`/Admin/responses/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedUserResponses(response.data);
    } catch (err) {
      console.error('Failed to fetch responses', err);
      setError('Failed to load responses for the user.');
    }
    setLoadingResponses(false);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phoneNumber);
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f0f4f8',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#2c3e50',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    responseContainer: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    chartContainer: {
      height: '400px',
      marginTop: '20px',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '50px',
      height: '50px',
      border: '3px solid rgba(0,0,0,.1)',
      borderRadius: '50%',
      borderTopColor: '#3498db',
      animation: 'spin 1s ease-in-out infinite',
    },
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' }
    },
    errorMessage: {
      backgroundColor: '#e74c3c',
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
    },
  };

  if (loading) {
    return <div style={styles.loadingSpinner}></div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User Details</h1>
      <input
        style={styles.input}
        placeholder="Search by name, email, or student ID..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Student ID</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Batch Number</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserDetails.length > 0 ? (
            filteredUserDetails.map((user, index) => (
              <tr key={user._id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.studentId}</td>
                <td style={styles.td}>{user.age}</td>
                <td style={styles.td}>{isValidPhoneNumber(user.mobileno) ? user.mobileno : 'Invalid'}</td>
                <td style={styles.td}>{user.batchno || 'No Batch'}</td>
                <td style={styles.td}>
                  <button style={styles.button} onClick={() => handleViewResponses(user.studentId)}>
                    View Responses
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{...styles.td, textAlign: 'center'}}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {loadingResponses && <div style={styles.loadingSpinner}></div>}

      {selectedUserResponses && (
        <div style={styles.responseContainer}>
          <h2 style={styles.header}>Responses for Student ID: {selectedUserResponses.studentId}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Question</th>
                <th style={styles.th}>Answer</th>
                <th style={styles.th}>Response Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedUserResponses.responses.map((response, index) => (
                <tr key={index}>
                  <td style={styles.td}>{response.questionText}</td>
                  <td style={styles.td}>{response.answer}</td>
                  <td style={styles.td}>{new Date(response.responseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedUserResponses.responses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="responseDate" 
                  tickFormatter={(date) => moment(date).format('YYYY-MM-DD')} 
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="answer" stroke="#82ca9d" name="Answer in Green" />
                <Line type="monotone" dataKey="answer" stroke="#FFD700" name="Answer in Yellow" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;