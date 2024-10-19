import React, { useEffect, useState } from 'react';
import Api from '../../Api/Api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserResponses, setSelectedUserResponses] = useState(null);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('Admin-Token');
        if (!token) {
          throw new Error('No token found. Please login again.');
        }

        const response = await Api.get('/Admin/alluser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data received from server');
        }

        setUserDetails(response.data);
        setFilteredUserDetails(response.data);
      } catch (err) {
        console.error('Failed to fetch user details', err);
        setError(err.message || 'Failed to load user details. Please try again later.');
      } finally {
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
    setError(null);
    try {
      const token = localStorage.getItem('Admin-Token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await Api.get(`/Admin/responses/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data || !response.data.responseData) {
        throw new Error('Invalid response data received from server');
      }

      setSelectedUserResponses(response.data.responseData || []);
      setAnalyticsData(response.data.analytics || {});
      
      // Process data for progress visualization
      if (response.data.responseData.responses) {
        const progressData = response.data.responseData.responses.reduce((acc, response) => {
          const date = moment(response.responseDate).format('YYYY-MM-DD');
          if (!acc[date]) {
            acc[date] = { date, yesCount: 0, totalResponses: 0 };
          }
          // Check if answer is a string and convert to lowercase, otherwise use a string representation
          const answerString = typeof response.answer === 'string' ? response.answer.toLowerCase() : String(response.answer).toLowerCase();
          if (answerString === 'yes') {
            acc[date].yesCount++;
          }
          acc[date].totalResponses++;
          return acc;
        }, {});

        setProgressData(Object.values(progressData));
      } else {
        setProgressData([]);
      }
    } catch (err) {
      console.error('Failed to fetch responses', err);
      setError(err.message || 'Failed to load responses for the user. Please try again later.');
    } finally {
      setLoadingResponses(false);
    }
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phoneNumber);
  };

  const calculateProgress = () => {
    if (!analyticsData || !analyticsData.analyticsResults) return 0;
    const totalYesCount = analyticsData.analyticsResults.reduce((sum, result) => sum + result.yesCount, 0);
    const totalQuestions = analyticsData.analyticsResults.length;
    return Math.round((totalYesCount / (totalQuestions * 10)) * 100); // Assuming 10 responses per question is the target
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="user-details">
      <h2>User Details</h2>
      {error && <div className="alert error">{error}</div>}
      <input
        type="text"
        placeholder="Search by name, email, or student ID..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Student ID</th>
            <th>Age</th>
            <th>Phone Number</th>
            <th>Batch Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserDetails.length > 0 ? (
            filteredUserDetails.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.studentId}</td>
                <td>{user.age}</td>
                <td>{isValidPhoneNumber(user.mobileno) ? user.mobileno : 'Invalid'}</td>
                <td>{user.batchno || 'No Batch'}</td>
                <td>
                  <button onClick={() => handleViewResponses(user.studentId)} className="view-button">
                    View Responses
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-users">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {loadingResponses && <div className="spinner"></div>}

      {selectedUserResponses && (
        <div className="responses-section">
          <h3>Responses for Student ID: {selectedUserResponses.studentId}</h3>
          {selectedUserResponses.responses && selectedUserResponses.responses.length > 0 ? (
            <>
              <table className="responses-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Response Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUserResponses.responses.map((response, index) => (
                    <tr key={index}>
                      <td>{response.questionText}</td>
                      <td>{response.answer}</td>
                      <td>{moment(response.responseDate).format('YYYY-MM-DD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="chart-container">
                <h4>Response Distribution</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={selectedUserResponses.responses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="responseDate" 
                      tickFormatter={(date) => moment(date).format('YYYY-MM-DD')} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="answer" fill="#82ca9d" name="Answer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {progressData && progressData.length > 0 && (
                <div className="chart-container">
                  <h4>Student Progress Over Time</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="yesCount" stroke="#8884d8" name="Yes Responses" />
                      <Line type="monotone" dataKey="totalResponses" stroke="#82ca9d" name="Total Responses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="progress-tracker">
                <h4>Overall Progress</h4>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${calculateProgress()}%`}}
                  ></div>
                </div>
                <p>Progress: {calculateProgress()}%</p>
                <p>Recommendation: {calculateProgress() >= 70 ? "Ready for next level" : "Needs more practice"}</p>
              </div>
            </>
          ) : (
            <p>No responses available for this student.</p>
          )}
        </div>
      )}

      {analyticsData && analyticsData.analyticsResults && (
        <div className="analytics-section">
          <h3>Analytics</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Yes Count</th>
                <th>No Count</th>
                <th>Total Multiple Choice</th>
                <th>Total Short Text</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.analyticsResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.questionText}</td>
                  <td>{result.yesCount}</td>
                  <td>{result.noCount}</td>
                  <td>{result.multipleChoiceCounts.length}</td>
                  <td>{result.shortTextResponses.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .user-details {
          padding: 20px;
          background-color: white;
          color: black;
        }

        h2, h3, h4 {
          font-size: 24px;
          margin-bottom: 16px;
        }

        h4 {
          font-size: 20px;
        }

        .search-input {
          width: 100%;
          padding: 8px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .user-table, .responses-table, .analytics-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .view-button {
          background-color: #3182ce;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .view-button:hover {
          background-color: #2c5282;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .error {
          background-color: #fed7d7;
          color: #9b2c2c;
        }

        .no-users {
          text-align: center;
          font-style: italic;
        }

        .responses-section, .analytics-section {
          margin-top: 20px;
        }

        .chart-container {
          margin-top: 20px;
          height: 400px;
        }

        .progress-tracker {
          margin-top: 20px;
          padding: 20px;
          background-color: #f0f0f0;
          border-radius: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background-color: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default UserDetails;