// EnterEmailForm.jsx
import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { useNavigate } from 'react-router-dom';

const EnterEmailForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    onSubmit(email);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Forgot Password</h2>
      <p className={styles.instruction}>
        Please enter your email and we'll send you a link to get back your
        account.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputGroup}>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address'
        />
        <label htmlFor='email'>Email Address</label>
      </div>
      <div className={styles.buttonGroup}>
        <button type='button' className={styles.cancelButton} onClick={() => navigate('/login')}>
          Cancel
        </button>
        <button type='submit' className={styles.submitButton}>
          Send
        </button>
      </div>
    </form>
  );
};

export default EnterEmailForm;
