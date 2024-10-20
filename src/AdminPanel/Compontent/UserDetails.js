import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Text, Spinner, Alert, AlertIcon, 
  ChakraProvider, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, 
  ModalCloseButton, FormControl, FormLabel, Stack, useToast
} from '@chakra-ui/react';
import Api from '../../Api/Api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [editingUser, setEditingUser] = useState(null);
  const [showResponses, setShowResponses] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    age: '',
    mobileno: '',
    batchno: ''
  });

  const toast = useToast();

  // Fetch User Details
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

  // Handle Search
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

  // View User Responses
  const handleViewResponses = async (studentId) => {
    setLoadingResponses(true);
    try {
      const token = localStorage.getItem('Admin-Token');
      const response = await Api.get(`/Admin/responses/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data.responseData || response.data.responseData.responses.length === 0) {
        toast({
          title: "No Responses",
          description: "This user hasn't submitted any responses yet.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setLoadingResponses(false);
        return;
      }

      setSelectedUserResponses(response.data.responseData || []);
      setAnalyticsData(response.data.analytics || {});
      setShowResponses(true);
    } catch (err) {
      console.error('Failed to fetch responses', err);
      toast({
        title: "Error",
        description: "Failed to fetch user responses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingResponses(false);
  };

  // Close Responses Modal
  const handleCloseResponses = () => {
    setShowResponses(false);
    setSelectedUserResponses(null);
    setAnalyticsData(null);
  };

  // Edit User Details
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      mobileno: user.mobileno,
      batchno: user.batchno || ''
    });
  };

  // Handle Form Change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit the Edited User Details
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('Admin-Token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await Api.patch(`/Admin/user/${editingUser.studentId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('Failed to update user details');
      }

      const updatedUsers = userDetails.map(user => 
        user.studentId === editingUser.studentId ? { ...user, ...editFormData } : user
      );
      setUserDetails(updatedUsers);
      setFilteredUserDetails(updatedUsers);
      setEditingUser(null);
      
      toast({
        title: "Success",
        description: "User details updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to update user details', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to update user details. Please try again later.',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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

        {/* Edit Modal */}
        <Modal isOpen={editingUser !== null} onClose={() => setEditingUser(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleEditSubmit}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <Input
                      type="number"
                      name="age"
                      value={editFormData.age}
                      onChange={handleEditFormChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="mobileno"
                      value={editFormData.mobileno}
                      onChange={handleEditFormChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Batch Number</FormLabel>
                    <Input
                      name="batchno"
                      value={editFormData.batchno}
                      onChange={handleEditFormChange}
                    />
                  </FormControl>

                  <Flex justifyContent="flex-end" gap={3}>
                    <Button onClick={() => setEditingUser(null)}>Cancel</Button>
                    <Button colorScheme="blue" type="submit" isLoading={loading}>
                      Save Changes
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* User Table */}
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
                    <Flex gap={2}>
                      <Button 
                        onClick={() => handleViewResponses(user.studentId)} 
                        colorScheme="blue" 
                        size="sm"
                      >
                        View
                      </Button>
                      <Button 
                        onClick={() => handleEditClick(user)} 
                        colorScheme="green" 
                        size="sm"
                      >
                        Edit
                      </Button>
                    </Flex>
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

        {showResponses && selectedUserResponses && (
          <Box mt={5}>
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text fontSize="xl">
                Responses for Student ID: {selectedUserResponses.studentId}
              </Text>
              <Button 
                onClick={handleCloseResponses}
                colorScheme="red"
                size="sm"
              >
                Close Responses
              </Button>
            </Flex>
            
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
                    <Td>{moment(response.responseDate).format('YYYY-MM-DD')}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {selectedUserResponses.responses.length > 0 && (
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
            )}
          </Box>
        )}

        {showResponses && analyticsData && (
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
