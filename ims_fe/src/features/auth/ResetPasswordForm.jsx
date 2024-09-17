// ResetPasswordForm.jsx
import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';

const ResetPasswordForm = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }
    if (
      password.length < 7 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      setError(
        'Password must contain at least one letter, one number, and seven characters.'
      );
      return;
    }
    onSubmit(password);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Reset Password</h2>
      <p className={styles.instruction}>
        Use at least one letter, one number and seven characters.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputGroup}>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder='Enter new password'
        />
        <label htmlFor='password'>New Password</label>
      </div>
      <div className={styles.inputGroup}>
        <input
          type='password'
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder='Confirm new password'
        />
        <label htmlFor='confirmPassword'>Confirm Password</label>
      </div>
      <button type='submit' className={styles.submitButton}>
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;
