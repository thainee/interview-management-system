import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { useNavigate } from 'react-router-dom';
import { setToast } from '../../store/uiSlice';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      dispatch(setToast({ type: 'error', message: 'Email can not be empty' }));
      return;
    }

    try {
      const formData = {
        email: email,
      };
      await forgotPassword(formData);
      dispatch(
        setToast({
          type: 'success',
          message: "We've sent an email with the link to reset your password.",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(setToast({ type: 'error', message: err.response.data.message }));
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.instruction}>
          Please enter your email and we'll send you a link to reset your
          password.
        </p>
        <div className={styles.inputGroup}>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Enter your email address'
          />
          <label htmlFor='email'>Email Address</label>
        </div>
        <div className={styles.buttonGroup}>
          <button
            type='button'
            className={styles.cancelButton}
            onClick={() => navigate('/login')}
          >
            Cancel
          </button>
          <button type='submit' className={styles.submitButton}>
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
