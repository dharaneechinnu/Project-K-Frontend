import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Flower } from 'lucide-react';
import Api from '../../Api/Api';

const MindfulnessProgress = () => {
    const [activeStage, setActiveStage] = useState(1);
    const [showTip, setShowTip] = useState(false);
    const [purchasedCourses, setPurchasedCourses] = useState([]); // Initialize as an empty array
    const [responseData, setResponseData] = useState([]);
    const [error, setError] = useState(null);
    const userId = JSON.parse(localStorage.getItem('user'))?.studentId;

    useEffect(() => {
        if (userId) {
            fetchUnlockedCourses();
        }
    }, [userId]);

    // Fetch unlocked courses with error handling and logging
    const fetchUnlockedCourses = async () => {
        try {
            console.log('Fetching unlocked courses for user:', userId);
            const { data } = await Api.get(`/course/unlocked-courses/${userId}`);
            if (data && Array.isArray(data.unlockedCourses)) {
                setPurchasedCourses(data.unlockedCourses); // Correctly set the array from unlockedCourses
                console.log('Unlocked courses fetched:', data.unlockedCourses);
            } else {
                setPurchasedCourses([]);
                throw new Error('Unexpected API response structure.');
            }
        } catch (error) {
            setPurchasedCourses([]);
            setError('Failed to fetch unlocked courses.');
            console.error('Error fetching unlocked courses:', error.message || error);
        }
    };

    // Fetch responses based on course with error handling and logging
    const fetchResponses = async (courseId) => {
        try {
            console.log('Fetching responses for course:', courseId);
            const studentId = JSON.parse(localStorage.getItem('user'))?.studentId;
            const { data } = await Api.get(`response/analytics/${courseId}/${studentId}`);
            if (data && data.analytics) {
                // Format responseData to include the dates for each response
                const formattedData = data.analytics.map(question => ({
                    ...question,
                    responseDates: question.responseDates.map(date => new Date(date).toLocaleDateString())
                }));
                setResponseData(formattedData);
                console.log('Response data fetched:', formattedData);
            } else {
                setResponseData([]);
                throw new Error('No response data available for this course.');
            }
            setError(null);
        } catch (error) {
            setResponseData([]); // Set empty data if there's an error
            setError(error.message || 'Error fetching response data.');
            console.error('Error fetching responses:', error.message || error);
        }
    };

    // Handle stage click and fetch responses for the selected course
    const handleStageClick = (index) => {
        setActiveStage(index + 1);
        const selectedCourse = purchasedCourses[index];
        if (selectedCourse) {
            console.log('Selected course:', selectedCourse.courseName);
            fetchResponses(selectedCourse.courseId);
        }
    };

    return (
        <Container id='progress'>
            <Title>Mindfulness Journey</Title>

            <GridContainer>
                <Card>
                    <CardTitle>Personal Growth Stages</CardTitle>
                    <StagesContainer>
                        {purchasedCourses.length > 0 ? (
                            purchasedCourses.map((course, index) => (
                                <Stage
                                    key={index}
                                    active={activeStage === index + 1}
                                    onClick={() => handleStageClick(index)}
                                >
                                    <StageHeader>
                                        <Flower color={activeStage === index + 1 ? '#4338ca' : '#a5b4fc'} size={24} />
                                        <StageName>{course.courseName}</StageName>
                                    </StageHeader>
                                    {activeStage === index + 1 && (
                                        <StageDescription>{course.courseDescription}</StageDescription>
                                    )}
                                </Stage>
                            ))
                        ) : (
                            <p>No unlocked courses available.</p>
                        )}
                    </StagesContainer>
                </Card>

                <Card>
                    <CardTitle>Response Metrics</CardTitle>
                    {error ? (
                        <ErrorMessage>{error}</ErrorMessage>
                    ) : (
                        <ChartContainer>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={responseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* Display responseDate in local format */}
                                    <XAxis dataKey="responseDates" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="yesCount" stroke="#82ca9d" name="Yes Count" />
                                    <Line type="monotone" dataKey="noCount" stroke="#8884d8" name="No Count" />
                                    {/* Render dynamic multiple-choice lines */}
                                    {responseData.length > 0 && responseData[0].multipleChoiceCounts &&
                                        Object.keys(responseData[0].multipleChoiceCounts).map((option, index) => (
                                            <Line
                                                key={index}
                                                type="monotone"
                                                dataKey={`multipleChoiceCounts.${option}`}
                                                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                                name={`Option ${option}`}
                                            />
                                        ))
                                    }
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}
                </Card>
            </GridContainer>

            <div style={{ marginTop: '2rem' }}>
                <TipButton onClick={() => setShowTip(!showTip)}>
                    {showTip ? 'Hide' : 'Show'} Mindfulness Tip
                </TipButton>

                {showTip && (
                    <CustomAlert>
                        <AlertTitle>Mindfulness Tip of the Day</AlertTitle>
                        <p>Take a moment to practice deep breathing. Inhale for 4 counts, hold for 4, and exhale for 4. This simple exercise can help center your mind and reduce stress.</p>
                    </CustomAlert>
                )}
            </div>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
  background: #f0f2f5;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a90e2;
  margin-bottom: 1rem;
`;

const StagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Stage = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: ${props => props.active ? '#e0e7ff' : 'transparent'};
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    background-color: #f3f4f6;
  }
`;

const StageHeader = styled.div`
  display: flex;
  align-items: center;
`;

const StageName = styled.span`
  font-weight: 500;
  margin-left: 0.5rem;
`;

const StageDescription = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4a90e2;
`;

const ChartContainer = styled.div`
  height: 400px;
`;

const TipButton = styled.button`
  margin: 1rem;
  padding: 1rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a90e3;
  }
`;

const CustomAlert = styled.div`
  background-color: #fef2f2;
  border-left: 4px solid #dc2626;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 0.375rem;
`;

const AlertTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
`;

export default MindfulnessProgress;
