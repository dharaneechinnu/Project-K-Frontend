import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Text, Spinner, Alert, AlertIcon, 
  ChakraProvider
} from '@chakra-ui/react';
import Api from '../../Api/Api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment'; // Import moment.js for date formatting

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserResponses, setSelectedUserResponses] = useState(null);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

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
      console.log("Response of user : ", response.data);
      setSelectedUserResponses(response.data.responseData || []); // Ensure responseData is at least an empty array
      setAnalyticsData(response.data.analytics || {}); // Ensure analytics is an object
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

  if (loading) {
    return <Spinner size="xl" color="blue.500" />;
  }

  if (error) {
    return <Alert status="error"><AlertIcon />{error}</Alert>;
  }

  return (
    <ChakraProvider>
      <Box p={5} bg="white" color="black">
        <Text fontSize="2xl" mb={4}>User Details</Text>
        <Input
          placeholder="Search by name, email, or student ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          mb={4}
        />
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Student ID</Th>
              <Th>Age</Th>
              <Th>Phone Number</Th>
              <Th>Batch Number</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUserDetails.length > 0 ? (
              filteredUserDetails.map((user, index) => (
                <Tr key={user._id}>
                  <Td>{index + 1}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.studentId}</Td>
                  <Td>{user.age}</Td>
                  <Td>{isValidPhoneNumber(user.mobileno) ? user.mobileno : 'Invalid'}</Td>
                  <Td>{user.batchno || 'No Batch'}</Td>
                  <Td>
                    <Button onClick={() => handleViewResponses(user.studentId)} colorScheme="blue" size="sm">
                      View Responses
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="8" textAlign="center">No users found.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {loadingResponses && <Spinner size="lg" color="blue.500" mt={5} />}

        {selectedUserResponses && (
          <Box mt={5}>
            <Text fontSize="xl" mb={3}>Responses for Student ID: {selectedUserResponses.studentId}</Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Question</Th>
                  <Th>Answer</Th>
                  <Th>Response Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedUserResponses.responses.map((response, index) => (
                  <Tr key={index}>
                    <Td>{response.questionText}</Td>
                    <Td>{response.answer}</Td>
                    <Td>{new Date(response.responseDate).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Bar Chart to display responses over time */}
            <Box mt={5}>
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
            </Box>
          </Box>
        )}

        {analyticsData && (
          <Box mt={5}>
            <Text fontSize="2xl" mb={4}>Analytics</Text>
            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th>Question</Th>
                  <Th>Yes Count</Th>
                  <Th>No Count</Th>
                  <Th>Total Multiple Choice</Th>
                  <Th>Total Short Text</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analyticsData.analyticsResults.map((result, index) => (
                  <Tr key={index}>
                    <Td>{result.questionText}</Td>
                    <Td>{result.yesCount}</Td>
                    <Td>{result.noCount}</Td>
                    <Td>{result.multipleChoiceCounts.length}</Td>
                    <Td>{result.shortTextResponses.length}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default UserDetails;
