import React, { useState } from 'react';
import Api from '../../Api/Api'; // Assuming you're using this for API requests

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    pincode: '',
    whatsappno: '', // Ensure this matches the backend field name
    mobileno: '',
    batchno: '', // Ensure this matches the backend field name
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
      const token = localStorage.getItem('Admin-Token'); // Retrieve token from localStorage

      const response = await Api.post('/Admin/userRegsiter', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      if (response.status === 200) {
        setMessage('User registered successfully');
        setError(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          age: '',
          gender: '',
          pincode: '',
          whatsappno: '', // Reset to ensure the form is cleared
          mobileno: '',
          batchno: '',
        });
      }
    } catch (error) {
      setError(true);
      setMessage(error.response ? error.response.data.message : 'Error registering user');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New User</h2>
      {message && (
        <div style={error ? styles.errorAlert : styles.successAlert}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={styles.genderSelect}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>WhatsApp Number</label>
          <input
            type="text"
            name="whatsappno" // Ensure the field name matches backend schema
            value={formData.whatsappno}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile Number</label>
          <input
            type="text"
            name="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Batch Number</label>
          <input
            type="text"
            name="batchno" // Ensure the field name matches backend schema
            value={formData.batchno}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.button}>
            Register User
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '20px',
    color: '#4A90E2',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  genderSelect: {
    width: '93.5%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  input: {
    width: '90%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  buttonContainer: {
    gridColumn: '1 / -1',
    marginTop: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  successAlert: {
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
  },
  errorAlert: {
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
  },
};

export default AddUser;
