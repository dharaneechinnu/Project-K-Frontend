import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Api from '../../Api/Api'; // Adjust path as necessary
import { Book, Lock, Unlock, ChevronRight } from 'lucide-react';

// Import your local images here
import course1Image from '../../Assest/r1.jpg';
import course2Image from '../../Assest/yog2.png';
import course3Image from '../../Assest/yog3.png';

// Create an object to map course IDs to local images
const courseImages = {
  1: course1Image,
  2: course2Image,
  3: course3Image,
};

const PAGE_SIZE = 3; // Number of courses per page

const Stage = () => {
  const [unlockedCourses, setUnlockedCourses] = useState([]); // Unlocked courses
  const [courseDetails, setCourseDetails] = useState([]); // All courses
  const [activeStage, setActiveStage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCourses, setLoadingCourses] = useState(true); // Loading state for courses
  const [loadingUnlockedCourses, setLoadingUnlockedCourses] = useState(true); // Loading state for unlocked courses
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'))?.studentId;
  const Bacthno = JSON.parse(localStorage.getItem('user'))?.batchno;

  useEffect(() => {
    if (userId) {
      fetchUnlockedCourses();
      fetchAllCourses();
    }
  }, [userId]);

  const fetchUnlockedCourses = async () => {
    try {
      setLoadingUnlockedCourses(true);
      const { data } = await Api.get(`/course/unlocked-courses/${userId}`);
      console.log('Unlocked Courses:', data); // Log the fetched data
      const unlockedCourseIds = data.unlockedCourses.map(course => course.courseId);
      setUnlockedCourses(unlockedCourseIds); // Set the unlocked course IDs to the state
    } catch (error) {
      console.error('Failed to fetch unlocked courses', error);
    } finally {
      setLoadingUnlockedCourses(false);
    }
  };
  
  const fetchAllCourses = async () => {
    try {
      setLoadingCourses(true);
      const { data } = await Api.get('/course/get-courses');
      console.log(data); // Log the response to see its structure

      if (data && Array.isArray(data.courses)) {
        setCourseDetails(data.courses);
      } else {
        console.error('Unexpected response format: courseDetails should be an array');
        setCourseDetails([]); // Fallback to an empty array if the response is not as expected
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
      setCourseDetails([]); // In case of an error, ensure courseDetails remains an array
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleRequestCourse = async (courseId, courseName) => {
    if (!userId) {
      alert('User is not logged in. Please log in to request a course.');
      return;
    }
  
    if (!courseId || !courseName) {
      alert('Invalid course selected.');
      return;
    }
  
    try {
      console.log(userId, courseId, Bacthno, courseName);
      const { data } = await Api.post('/course/request-course', { userId, courseId, courseName, Bacthno });
       console.log(data);

      if (data && data.message) {
        alert(data.message);
      } else {
        alert('Course request sent successfully.');
      }
    } catch (error) {
      console.error('Failed to send course request', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while sending the course request. Please try again later.');
      }
    }
  };
  
  const getStageStatus = (courseId) => {
    // Check if the course is unlocked by looking for its courseId in unlockedCourses array
    if (unlockedCourses.includes(courseId)) {
      return 'unlocked';
    }
    const index = courseDetails.findIndex(course => course.courseId === courseId);
    if (index === 0 || unlockedCourses.includes(courseDetails[index - 1]?.courseId)) {
      return 'current'; // Allow unlocking the current stage if the previous one is unlocked
    }
    return 'locked';
  };
  
  const totalPages = Math.ceil(courseDetails.length / PAGE_SIZE);
  const currentPageCourses = courseDetails.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container id="stage">
      <Header>
        <Title>Your Journey to Inner Peace</Title>
        <Subtitle>Unlock each stage to progress on your path to mindfulness and self-discovery</Subtitle>
      </Header>
      <StagesContainer>
      {loadingCourses || loadingUnlockedCourses ? (
        <LoadingMessage>Loading courses...</LoadingMessage>
      ) : Array.isArray(currentPageCourses) && currentPageCourses.length > 0 ? (
        currentPageCourses.map((course) => {
          const status = getStageStatus(course.courseId);
          return (
            <StageCard
              key={course.courseId}
              onClick={() => {
                if (status === 'unlocked') {
                  navigate(`/yogoform/${course.courseId}`);
                } else {
                  setActiveStage(activeStage === course.courseId ? null : course.courseId);
                }
              }}
              active={activeStage === course.courseId}
              status={status}
            >
              <StageImage src={courseImages[course.courseId] || courseImages[1]} alt={course.courseName} />
              <StageContent>
                <StageHeader>
                  <StageIcon status={status}>
                    {status === 'unlocked' ? <Unlock /> : status === 'current' ? <Book /> : <Lock />}
                  </StageIcon>
                  <StageName>{course.courseName}</StageName>
                </StageHeader>
                <StageDescription>{course.courseDescription}</StageDescription>
                {activeStage === course.courseId && (
                  <StageDetails>
                    <DetailText>
                      {course.detailedDescription || "Embark on a journey of self-discovery and inner peace with this transformative course."}
                    </DetailText>
                    {status === 'unlocked' ? (
                      <ActionButton onClick={() => navigate(`/yogoform/${course.courseId}`)}>
                        Continue Your Journey <ChevronRight size={16} />
                      </ActionButton>
                    ) : status === 'current' ? (
                      <ActionButton onClick={() => handleRequestCourse(course.courseId, course.courseName)}>
                        Request Access <Unlock size={16} />
                      </ActionButton>
                    ) : (
                      <LockedMessage>Complete previous stages to unlock</LockedMessage>
                    )}
                  </StageDetails>
                )}
              </StageContent>
            </StageCard>
          );
        })
      ) : (
        <NoCoursesMessage>No courses available at this time.</NoCoursesMessage>
      )}

      </StagesContainer>
      <PaginationContainer>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </PaginationButton>
        <PaginationInfo>
          Page {currentPage} of {totalPages}
        </PaginationInfo>
        <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </PaginationButton>
      </PaginationContainer>
      <ProgressIndicator>
        <ProgressText>Your Progress: {unlockedCourses.length} / {courseDetails.length} Stages Completed</ProgressText>
        <ProgressBar width={(unlockedCourses.length / (courseDetails.length || 1)) * 100} />
      </ProgressIndicator>
    </Container>
  );
};
// Styled Components
const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f7f7f7;
  min-height: 100vh;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

const PaginationButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin: 0 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #3a7bc8;
  }
`;

const PaginationInfo = styled.span`
  font-size: 1rem;
  color: #333;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
`;

const StagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const NoCoursesMessage = styled.p`
  text-align: center;
  color: #999;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #4a90e2;
`;

const StageCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  ${({ active }) => active && `
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  `}

  ${({ status }) => status === 'locked' && `
    opacity: 0.7;
  `}
`;

const StageImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const StageContent = styled.div`
  padding: 1.5rem;
`;

const StageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const StageIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  background-color: ${({ status }) => 
    status === 'unlocked' ? '#28a745' : 
    status === 'current' ? '#fda638' : 
    '#6c757d'};
`;

const StageName = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  color: #333;
`;

const StageDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const StageDetails = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const DetailText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: #3a7bc8;
  }
`;

const LockedMessage = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
`;

const ProgressIndicator = styled.div`
  margin-top: 2rem;
`;

const ProgressText = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.width}%;
    background-color: #28a745;
    transition: width 0.5s ease;
  }
`;

export default Stage;
