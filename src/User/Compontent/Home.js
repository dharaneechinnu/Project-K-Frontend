import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Camera, Book, Award, CheckCircle } from 'lucide-react';

const Home = () => {
  const [activeSection, setActiveSection] = useState('');
  const [userData, setUserData] = useState(null);
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();

  const quotes = [
    "Peace comes from within. Do not seek it without.",
    "The mind is everything. What you think you become.",
    "Happiness is a journey, not a destination.",
    "Be the change you wish to see in the world.",
    "Live in the present moment. It's the only moment you have."
  ];

  useEffect(() => {
    const localstorage = localStorage.getItem('user');
    if (!localstorage) {
      navigate('/login');
    }
    const fetchedUserData = JSON.parse(localstorage);
    setUserData(fetchedUserData);

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const intervalId = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'enrolled':
        return (
          <ContentCard>
            <h3>Enrolled Courses</h3>
            <p>You are currently enrolled in several courses:</p>
            <ul>
              <li>Mindfulness Meditation</li>
              <li>Yoga for Beginners</li>
              <li>Stress Management Techniques</li>
            </ul>
            <Button>View Courses</Button>
          </ContentCard>
        );
      case 'certification':
        return (
          <ContentCard>
            <h3>Certifications</h3>
            <p>Congratulations on completing your certifications!</p>
            <ul>
              <li>Certified Meditation Practitioner</li>
              <li>Yoga Instructor Level 1</li>
            </ul>
            <Button>View Certificates</Button>
          </ContentCard>
        );
      case 'completed':
        return (
          <ContentCard>
            <h3>Completed Courses</h3>
            <p>You've completed several courses. Check out your achievements!</p>
            <ul>
              <li>Introduction to Mindfulness</li>
              <li>Art of Breathing</li>
              <li>Positive Psychology</li>
            </ul>
            <Button>View Achievements</Button>
          </ContentCard>
        );
      default:
        return (
          <ContentCard>
            <h3>Welcome to Your Journey</h3>
            <p>Select an option to view more details about your progress and achievements.</p>
            <p>Remember: Every step you take is a step towards inner peace and self-discovery.</p>
          </ContentCard>
        );
    }
  };

  return (
    <Container id='home'>
      <ContentWrapper>
        <WelcomeSection>
          <ProfileImageContainer>
            <ProfileImage>
              <Camera size={40} />
            </ProfileImage>
          </ProfileImageContainer>
          <Content>
            <Title>Welcome, {userData ? userData.name : 'Seeker of Peace'}!</Title>
            <Description>Embark on your journey to inner peace and self-discovery.</Description>
            <Button>Begin Your Practice</Button>
          </Content>
        </WelcomeSection>

        <QuoteSection>
          <QuoteText>"{quote}"</QuoteText>
        </QuoteSection>

        <ButtonSection>
          <ActionButton
            isActive={activeSection === 'enrolled'}
            onClick={() => setActiveSection('enrolled')}
          >
            <Book size={20} />
            Enrolled
          </ActionButton>
          <ActionButton
            isActive={activeSection === 'certification'}
            onClick={() => setActiveSection('certification')}
          >
            <Award size={20} />
            Certification
          </ActionButton>
          <ActionButton
            isActive={activeSection === 'completed'}
            onClick={() => setActiveSection('completed')}
          >
            <CheckCircle size={20} />
            Completed
          </ActionButton>
        </ButtonSection>

        <ContentSection>{renderContent()}</ContentSection>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f7f7f7;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 90%;
`;

const WelcomeSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #e6f2ff;
  gap: 20px;
  margin-top: 4.5rem;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const ProfileImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #c1e3ff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4a90e2;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  margin: 10px 0;
  font-size: 1.1rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #4a90e2;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }
`;

const QuoteSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const QuoteText = styled.p`
  font-style: italic;
  text-align: center;
  color: #555;
  font-size: 1.1rem;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 0.9rem;
  background-color: ${props => props.isActive ? '#4a90e2' : '#fff'};
  color: ${props => props.isActive ? '#fff' : '#333'};
  border: 2px solid #4a90e2;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #4a90e2;
    color: #fff;
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
  }
`;

const ContentSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ContentCard = styled.div`
  h3 {
    color: #4a90e2;
    margin-bottom: 15px;
    text-align: center;
  }

  p {
    color: #555;
    margin-bottom: 15px;
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-bottom: 20px;

    li {
      margin-bottom: 8px;
      color: #666;
      text-align: center;
    }
  }

  ${Button} {
    display: block;
    margin: 0 auto;
  }
`;

export default Home;