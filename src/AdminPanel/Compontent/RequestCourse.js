import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Api from '../../Api/Api';

const AllCourseRequests = () => {
  const [courseRequests, setCourseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCourseRequests = async () => {
      try {
        const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage

        if (!token) {
          setError('No token found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await Api.get('/Admin/get-all-course-requests', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        console.log("request course : ",response.data);
        setCourseRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch course requests', err);
        setError('Failed to load course requests.');
        setLoading(false);
      }
    };

    fetchAllCourseRequests();
  }, []);

  const handleApprove = async (courseId, userId) => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token again

      console.log("Approving course with courseId:", courseId, "and userId:", userId);
      const response = await Api.post('/Admin/approve-course-request', { courseId, userId }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      alert(response.data.message);

      // Remove the request from the list after approval
      setCourseRequests(courseRequests.filter(request => request.courseId !== courseId));
    } catch (err) {
      console.error('Failed to approve course request', err);
      alert('Error approving course request.');
    }
  };

  const handleDeny = async (courseId, userId) => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token again

      console.log("Denying course with courseId:", courseId, "and userId:", userId);
      const response = await Api.post('/course/deny-course-request', { courseId, userId }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      alert(response.data.message);

      // Remove the request from the list after denial
      setCourseRequests(courseRequests.filter(request => request.courseId !== courseId));
    } catch (err) {
      console.error('Failed to deny course request', err);
      alert('Error denying course request.');
    }
  };

  if (loading) {
    return <LoadingMessage>Loading course requests...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Section>
      <SectionTitle>All Course Requests</SectionTitle>
      <StyledTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Batch Number</th>
            <th>Course ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseRequests.length > 0 ? (
            courseRequests.map((request, index) => (
              <tr key={request._id}>
                <td>{index + 1}</td>
                <td>{request.userId}</td>
                <td>{request.batchNumber}</td>
                <td>{request.courseId}</td>
                <td>
                  <ApproveButton onClick={() => handleApprove(request.courseId, request.userId)}>
                    Approve
                  </ApproveButton>
                  <DenyButton onClick={() => handleDeny(request.courseId, request.userId)}>
                    Deny
                  </DenyButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No course requests found.
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>
    </Section>
  );
};

// Styled components
const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #4A90E2;
  margin-bottom: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background-color: #4A90E2;
    color: white;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

const LoadingMessage = styled.p`
  font-size: 16px;
  color: #4A90E2;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
`;

const ApproveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const DenyButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

export default AllCourseRequests;
