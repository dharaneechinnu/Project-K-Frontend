import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  ChakraProvider,
  ButtonGroup,
} from '@chakra-ui/react';
import Api from '../../Api/Api';

const AllCourseRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // Tracks the current tab: 'pending' or 'approved'

  useEffect(() => {
    const fetchCourseRequests = async () => {
      try {
        const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage
        const response = await Api.get('/Admin/get-all-course-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming you have state variables for pending and approved requests
        setPendingRequests(response.data.pendingRequests);
        setApprovedRequests(response.data.approvedRequests);
        setLoading(false); // Mark loading as false after fetching data
      } catch (error) {
        console.error('Failed to fetch course requests', error);
        setError('Failed to load course requests.');
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchCourseRequests();
  }, []);

  const handleApprove = async (courseId, studentId) => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token again

      console.log('Approving course with courseId:', courseId, 'and studentId:', studentId);
      const response = await Api.post(
        '/Admin/approve-course-request',
        { courseId, studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      alert(response.data.message);

      // Update pending and approved lists after approval
      const updatedPendingRequests = pendingRequests.filter((request) => request.courseId !== courseId);
      const approvedRequest = pendingRequests.find((request) => request.courseId === courseId);
      setPendingRequests(updatedPendingRequests);
      setApprovedRequests([...approvedRequests, { ...approvedRequest, approve: true }]);
    } catch (err) {
      console.error('Failed to approve course request', err);
      alert('Error approving course request.');
    }
  };

  const handleDeny = async (courseId, studentId) => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token

      console.log('Denying course with courseId:', courseId, 'and studentId:', studentId);
      const response = await Api.post(
        '/Admin/deny-course-request',
        { courseId, studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      alert(response.data.message);

      // Update the pending requests after denial
      setPendingRequests(pendingRequests.filter((request) => request.courseId !== courseId));
    } catch (err) {
      console.error('Failed to deny course request', err);
      alert('Error denying course request.');
    }
  };

  const handleComplete = async (courseId, studentId) => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token

      console.log('Marking course as complete with courseId:', courseId, 'and studentId:', studentId);
      const response = await Api.post(
        '/Admin/complete-course',
        { courseId, studentId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      alert(response.data.message);

      // Optionally update the UI after marking the course complete
    } catch (err) {
      console.error('Failed to complete course', err);
      alert('Error marking course as complete.');
    }
  };

  if (loading) {
    return <Spinner size="xl" color="blue.500" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <ChakraProvider>
      <Box p={5}>
        {/* Tab Buttons */}
        <ButtonGroup spacing="6" mb={6}>
          <Button colorScheme={activeTab === 'pending' ? 'blue' : 'gray'} onClick={() => setActiveTab('pending')}>
            Pending Course Requests
          </Button>
          <Button colorScheme={activeTab === 'approved' ? 'blue' : 'gray'} onClick={() => setActiveTab('approved')}>
            Approved Courses
          </Button>
        </ButtonGroup>

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'pending' ? (
          <Box flex="1" bg="white" p={5} borderRadius="md" boxShadow="md">
            <Text fontSize="2xl" mb={5} fontWeight="bold" color="blue.500">
              Pending Course Requests
            </Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Student Name</Th>
                  <Th>Mobile Number</Th>
                  <Th>Batch Number</Th>
                  <Th>Course Name</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request, index) => (
                    <Tr key={request._id}>
                      <Td>{index + 1}</Td>
                      <Td>{request.userName}</Td>
                      <Td>{request.mobileno}</Td>
                      <Td>{request.batchNumber}</Td>
                      <Td>{request.courseName}</Td>
                      <Td>
                        <ButtonGroup spacing="3">
                          <Button colorScheme="green" size="sm" onClick={() => handleApprove(request.courseId, request.studentId)}>
                            Approve
                          </Button>
                          <Button colorScheme="red" size="sm" onClick={() => handleDeny(request.courseId, request.studentId)}>
                            Deny
                          </Button>
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="6" textAlign="center">
                      No pending requests found.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box flex="1" bg="white" p={5} borderRadius="md" boxShadow="md">
            <Text fontSize="2xl" mb={5} fontWeight="bold" color="blue.500">
              Approved Courses
            </Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Student Name</Th>
                  <Th>Mobile Number</Th>
                  <Th>Batch Number</Th>
                  <Th>Course Name</Th>
                  <Th>Action</Th> {/* Added Action Column for Complete button */}
                </Tr>
              </Thead>
              <Tbody>
                {approvedRequests.length > 0 ? (
                  approvedRequests.map((request, index) => (
                    <Tr key={request._id}>
                      <Td>{index + 1}</Td>
                      <Td>{request.userName}</Td>
                      <Td>{request.mobileno}</Td>
                      <Td>{request.batchNumber}</Td>
                      <Td>{request.courseName}</Td>
                      <Td>
                        <Button colorScheme="blue" size="sm" onClick={() => handleComplete(request.courseId, request.studentId)}>
                          Complete
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="6" textAlign="center">
                      No approved requests found.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default AllCourseRequests;
