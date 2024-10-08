import React, { useState } from 'react';
import styled from 'styled-components';
import Api from '../../Api/Api'; // Assuming you have your API setup

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    pincode: '',
    whatappno: '',
    mobileno: '',
    batchNumber: '', // Match the backend field 'batchNumber'
    paymentStatus: '', // Match the backend field 'paymentStatus'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);

    try {
      const response = await Api.post('/Admin/userRegsiter', formData);
      if (response.status === 200) {
        setMessage('User registered successfully');
        setError(false);
        // Clear form fields after successful registration
        setFormData({
          name: '',
          email: '',
          password: '',
          age: '',
          gender: '',
          pincode: '',
          whatappno: '',
          mobileno: '',
          batchNumber: '',
          paymentStatus: '',
        });
      }
    } catch (error) {
      setError(true);
      setMessage(
        error.response ? error.response.data.message : 'Error registering user'
      );
    }
  };

  return (
    <AddUserContainer>
      <Title>Add New User</Title>
      {message && <Message error={error}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </FormGroup>
        <FormGroup>
          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>WhatsApp Number</label>
          <input
            type="text"
            name="whatappno"
            value={formData.whatappno}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Batch Number</label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Register User</SubmitButton>
      </Form>
    </AddUserContainer>
  );
};

// Styled Components
const AddUserContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Message = styled.p`
  text-align: center;
  color: ${(props) => (props.error ? 'red' : 'green')};
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }
`;

export default AddUser;
