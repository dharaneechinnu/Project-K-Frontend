import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../Api/Api';
import { AlertCircle, Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await Api.post('/Admin/adminlogin', { email, password });
      const { adminToken, admin } = response.data;
      if (response.status === 200) {
        localStorage.setItem('Admin-Token', adminToken);
        localStorage.setItem('Admin-user', JSON.stringify(admin));
        navigate('/DashBoard');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Admin Login</h2>
        </div>
        <div style={styles.cardContent}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <div style={styles.inputWrapper}>
                <Mail style={styles.icon} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <Lock style={styles.icon} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <div style={styles.error}>
                <AlertCircle style={styles.errorIcon} />
                <p>{error}</p>
              </div>
            )}
            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '5px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#888',
  },
  input: {
    width: '100%',
    padding: '10px 10px 10px 35px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    color: '#e63946',
    fontSize: '14px',
  },
  errorIcon: {
    marginRight: '8px',
    width: '20px',
    height: '20px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default AdminLogin;
