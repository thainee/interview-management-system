// LoginForm.jsx
import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { createToken } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const formData = {
        username: username,
        password: password,
      };

      const response = await createToken(formData);

      const { token } = response;
      localStorage.setItem('token', token);

      // Set the expiration time (1 hour from now)
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
      localStorage.setItem('tokenExpiration', expirationTime);

      navigate('/home'); // Chuyển hướng đến dashboard sau khi đăng nhập thành công
    } catch (error) {
      if (error.response) {
        // Lỗi từ server với response
        setError(
          error.response.data.message || 'Login failed. Please try again.'
        );
      } else if (error.request) {
        // Lỗi không có response từ server
        setError('No response from server. Please try again later.');
      } else {
        // Lỗi khác
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Welcome back to IMS</h2>
        <p className={styles.subtitle}>Please login to your account</p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Enter your username'
          />
          <label htmlFor='username'>Username</label>
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Enter your password'
          />
          <label htmlFor='password'>Password</label>
          <button
            type='button'
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <div className={styles.forgotPassword}>
          <Link to={'/forgot-password'}>Forgot Password?</Link>
        </div>
        <div className={styles.buttonGroup}>
          <button type='submit' className={styles.loginButton}>
            {!isLoading ? 'Login' : 'Logging in...'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
