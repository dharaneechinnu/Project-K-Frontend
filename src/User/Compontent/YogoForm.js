import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower, Send, ArrowLeft } from 'lucide-react';
import Api from '../../Api/Api';
import { keyframes } from 'styled-components';

const YogoForm = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [courseId]);

  const fetchQuestions = async () => {
    try {
      const response = await Api.get(`/api/courses/${courseId}/questions`);
      if (response && response.data && Array.isArray(response.data)) {
        const formattedQuestions = response.data.map((question) => ({
          ...question,
          options: question.answerType === 'yes-no' 
            ? ['Yes', 'No'] 
            : question.options?.map((option) => option.optionText) || [],  // Handle undefined options
        }));
        setQuestions(formattedQuestions);
      } else {
        console.error('API returned unexpected data format');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Failed to fetch questions', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (questionId, value) => {
    setFormData({
      ...formData,
      [questionId]: value,
    });
  };

  const handleMultipleChoiceChange = (questionId, option) => {
    setFormData((prevFormData) => {
      const currentAnswers = prevFormData[questionId] || [];
      const isSelected = currentAnswers.includes(option);

      if (isSelected) {
        return {
          ...prevFormData,
          [questionId]: currentAnswers.filter((answer) => answer !== option),
        };
      } else {
        return {
          ...prevFormData,
          [questionId]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = JSON.parse(localStorage.getItem('user'))?.studentId;
    const token = localStorage.getItem('token');
  
    const submissionData = {
      courseId,
      studentId,
      responses: questions.map((question) => ({
        questionId: question._id || question.id,  // Use `_id` or `id` depending on the response format
        answer: formData[question._id || question.id] || "",
        questionText: question.questionText,
        answerType: question.answerType,
        options: question.options,
      })),
    };
    console.log(submissionData)
    try {
      await Api.post(`/api/courses/${courseId}/submit-daily-responses`, submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      alert('Responses submitted successfully!');
      navigate('/UserPanel');
    } catch (error) {
      console.error('Error submitting responses:', error);
      alert('Failed to submit responses. Please try again.');
    }
  };
  

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleBackClick = () => {
    navigate('/UserPanel');
  };

  if (loading) {
    return (
      <CenteredContainer>
        <LoadingMessage>Loading your mindfulness journey...</LoadingMessage>
      </CenteredContainer>
    );
  }

  return (
    <PageWrapper>
      <FormWrapper>
        <Header>
          <BackButton onClick={handleBackClick}>
            <ArrowLeft size={24} />
            Back
          </BackButton>
          <Flower size={48} color="#4caf50" />
          <h2>Mindfulness Questionnaire</h2>
        </Header>
        <ProgressBar progress={(currentQuestionIndex + 1) / questions.length * 100} />
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {questions.length > 0 && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <QuestionWrapper>
                  <QuestionNumber>Question {currentQuestionIndex + 1} of {questions.length}</QuestionNumber>
                  <Label>{questions[currentQuestionIndex].questionText}</Label>
                  {questions[currentQuestionIndex].answerType === 'short-text' && (
                    <Input
                      type="text"
                      value={formData[questions[currentQuestionIndex]._id] || ""}
                      onChange={(e) => handleInputChange(questions[currentQuestionIndex]._id, e.target.value)}
                      required
                      placeholder="Enter your thoughts here..."
                    />
                  )}
                  {questions[currentQuestionIndex].answerType === 'yes-no' && (
                    <ButtonGroup>
                      {questions[currentQuestionIndex].options.map((option) => (
                        <OptionButton
                          key={option}
                          type="button"
                          selected={formData[questions[currentQuestionIndex]._id] === option}
                          onClick={() => handleInputChange(questions[currentQuestionIndex]._id, option)}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </ButtonGroup>
                  )}
                  {questions[currentQuestionIndex].answerType === 'multiple-choice' && (
                    <ButtonGroup>
                      {questions[currentQuestionIndex].options.map((option) => (
                        <OptionButton
                          key={option}
                          type="button"
                          selected={formData[questions[currentQuestionIndex]._id]?.includes(option)}
                          onClick={() => handleMultipleChoiceChange(questions[currentQuestionIndex]._id, option)}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </ButtonGroup>
                  )}
                </QuestionWrapper>
              </motion.div>
            )}
          </AnimatePresence>
          <NavigationButtons>
            <NavButton type="button" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>Previous</NavButton>
            {currentQuestionIndex === questions.length - 1 ? (
              <SubmitButton type="submit">
                <Send size={18} />
                Submit
              </SubmitButton>
            ) : (
              <NavButton type="button" onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</NavButton>
            )}
          </NavigationButtons>
        </form>
      </FormWrapper>
    </PageWrapper>
  );
};

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  padding: 20px;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  animation: ${fadeIn} 1s ease-out;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;

  h2 {
    margin-top: 15px;
    color: #3498db;
  }

  svg:not(:first-child) {
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  font-size: 16px;
  color: #3498db;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin-bottom: 30px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #3498db;
    transition: width 0.5s ease-in-out;
  }
`;

const QuestionWrapper = styled.div`
  margin-bottom: 30px;
`;

const QuestionNumber = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 500;
  color: #2c3e50;
  display: block;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3498db;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const OptionButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: 2px solid ${props => props.selected ? '#3498db' : '#bdc3c7'};
  border-radius: 25px;
  background-color: ${props => props.selected ? '#3498db' : 'transparent'};
  color: ${props => props.selected ? 'white' : '#34495e'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.selected ? '#2980b9' : '#ecf0f1'};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  background-color: #95a5a6;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7f8c8d;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-radius: 25px;
  background-color: #2ecc71;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #27ae60;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
`;

const LoadingMessage = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: #34495e;
`;

const SubmittedMessage = styled.div`
  text-align: center;
  color: #2c3e50;

  h2 {
    margin: 20px 0;
    font-size: 28px;
  }

  p {
    font-size: 18px;
  }

  svg {
    margin-bottom: 20px;
  }
`;

export default YogoForm;