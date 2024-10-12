import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Send, Plus, Minus, Edit2, Trash2, LogOut } from 'lucide-react';
import Api from '../../Api/Api'; // Your API handler
import { v4 as uuid } from 'uuid';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const AdminAddQuestion = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [formQuestions, setFormQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchQuestionsByCourse(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage
      const { data } = await Api.get('/course/get-courses', {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      });
      console.log("Success in add queston")
      if (data.courses && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
      setCourses([]);
    }
  };

  const fetchQuestionsByCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage
      const { data } = await Api.get(`/api/questions/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      });
      console.log("Success in get queston")
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage
        await Api.delete(`/Admin/delete-question/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        });
        alert('Question deleted successfully!');
        fetchQuestionsByCourse(selectedCourse);
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Admin-Token'); // Get the token from localStorage
      const payload = {
        courseId: selectedCourse,
        questions: formQuestions.map((q) => ({
          questionText: q.questionText,
          answerType: q.answerType,
          options: q.options.map(opt => ({ optionText: opt.optionText })) // Ensure correct structure
        }))
      };

      if (isEditing && editingQuestionId) {
        await Api.put(`/Admin/edit-question/${editingQuestionId}`, payload.questions[0], {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        });
        alert('Question updated successfully!');
      } else {
        await Api.post('/Admin/add-form', payload, {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        });
        alert('Form added successfully!');
      }

      setFormQuestions([]);
      setEditingQuestionId(null);
      setIsEditing(false);
      fetchQuestionsByCourse(selectedCourse);
    } catch (error) {
      console.error('Error adding/updating form:', error.message);
      alert('Failed to process request. Please check the server connection.');
    }
  };




  const addQuestion = () => {
    setFormQuestions([
      ...formQuestions,
      {
        id: uuid(),
        questionText: '',
        answerType: 'yes-no',
        options: [
          { optionText: 'Yes' },
          { optionText: 'No' },
        ],
      },
    ]);
  };

  const updateQuestionText = (index, text) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[index].questionText = text;
    setFormQuestions(updatedQuestions);
  };

  const updateAnswerType = (index, type) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[index].answerType = type;

    if (type === 'yes-no') {
      updatedQuestions[index].options = [
        { optionText: 'Yes' },
        { optionText: 'No' },
      ];
    } else if (type === 'multiple-choice') {
      updatedQuestions[index].options = [
        { optionText: '' },
        { optionText: '' },
      ];
    } else {
      updatedQuestions[index].options = [];
    }

    setFormQuestions(updatedQuestions);
  };

  const updateOptionText = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[questionIndex].options[optionIndex].optionText = text;
    setFormQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[questionIndex].options.push({ optionText: '' });
    setFormQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formQuestions.filter((_, i) => i !== index);
    setFormQuestions(updatedQuestions);
  };

  
  

  const handleEdit = (question) => {
    setFormQuestions([{
      id: question._id,
      questionText: question.questionText,
      answerType: question.answerType,
      options: question.options,
    }]);
    setEditingQuestionId(question._id);
    setIsEditing(true);
  };



  return (
    <Container>
      <Header>
        <Title>
          Mindfulness Question Management
        </Title>
        <LogoutButton onClick={() => alert('Logout functionality not implemented.')}>
          <LogOut size={18} />
          Logout
        </LogoutButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Select Course</Label>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </Select>
        </FormGroup>

        {formQuestions.map((question, index) => (
          <QuestionBlock key={question.id}>
            <FormGroup>
              <Label>Question {index + 1}</Label>
              <TextArea
                placeholder="Enter your question here"
                value={question.questionText}
                onChange={(e) => updateQuestionText(index, e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Answer Type</Label>
              <Select
                value={question.answerType}
                onChange={(e) => updateAnswerType(index, e.target.value)}
              >
                <option value="yes-no">Yes/No</option>
                <option value="short-text">Short Text</option>
                <option value="multiple-choice">Multiple Choice</option>
              </Select>
            </FormGroup>

            {question.answerType === 'multiple-choice' && (
              <OptionsContainer>
                <Label>Options</Label>
                {question.options.map((option, optIndex) => (
                  <OptionInput
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={option.optionText}
                    onChange={(e) =>
                      updateOptionText(index, optIndex, e.target.value)
                    }
                    required
                  />
                ))}
                <AddButton type="button" onClick={() => addOption(index)}>
                  <Plus size={18} />
                  Add Option
                </AddButton>
              </OptionsContainer>
            )}

            <RemoveButton type="button" onClick={() => removeQuestion(index)}>
              <Minus size={18} />
              Remove Question
            </RemoveButton>
          </QuestionBlock>
        ))}

        <AddButton type="button" onClick={addQuestion}>
          <Plus size={18} />
          Add Question
        </AddButton>
        <SubmitButton type="submit">
          <Send size={18} />
          {isEditing ? 'Update Question' : 'Submit Form'}
        </SubmitButton>
      </Form>

      <QuestionsList>
        <Title>Existing Questions ({questions.length})</Title>
        {questions.map((question) => (
          <QuestionItem key={question._id}>
            <QuestionText>{question.questionText}</QuestionText>
            <ActionButtons>
              <EditButton onClick={() => handleEdit(question)}>
                <Edit2 size={18} />
                Edit
              </EditButton>
              <DeleteButton onClick={() => handleDelete(question._id)}>
                <Trash2 size={18} />
                Delete
              </DeleteButton>
            </ActionButtons>
          </QuestionItem>
        ))}
      </QuestionsList>
    </Container>
  );
};

export const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: auto;
  max-height: 600px;
  animation: ${fadeIn} 1s ease-out;
`;

// Header Section
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

`;

// Title with Icon
export const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  color: #4A90E2;
`;

// Logout Button
export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

// Form
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Form Group
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Label
export const Label = styled.label`
  font-weight: bold;
  color: #333;
  font-size: 1rem;
`;

// Select Dropdown
export const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #bdc3c7;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

// Question Block
export const QuestionBlock = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Text Area for Questions
export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #bdc3c7;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

// Options Container
export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Option Input Field
export const OptionInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #bdc3c7;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

// Button Base
export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Add Button
export const AddButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
  }
`;

// Remove Button
export const RemoveButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

// Submit Button
export const SubmitButton = styled(Button)`
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
  }
`;

// Questions List Container
export const QuestionsList = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

// Individual Question Item
export const QuestionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

// Question Text
export const QuestionText = styled.span`
  flex: 1;
  color: #34495e;
  font-size: 1rem;
`;

// Action Buttons Container
export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Edit Button
export const EditButton = styled(Button)`
  background-color: #f39c12;
  color: white;

  &:hover {
    background-color: #d35400;
  }
`;

// Delete Button
export const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;
export default AdminAddQuestion;
