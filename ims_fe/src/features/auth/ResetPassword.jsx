import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import { changePassword } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { setToast } from '../../store/uiSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const params = new URLSearchParams(location.search);
    const token = params.get('token') || '';

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }

    if (
      newPassword.length < 7 ||
      !/\d/.test(newPassword) ||
      !/[a-zA-Z]/.test(newPassword)
    ) {
      setError(
        'Password must contain at least one letter, one number, and seven characters.'
      );
      return;
    }

    try {
      const formData = {
        token,
        newPassword,
        confirmPassword,
      };
      await changePassword(formData);
      dispatch(
        setToast({
          type: 'success',
          message: 'Your password has been successfully reset.',
        })
      );
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      dispatch(
        setToast({
          type: 'error',
          message: err.response.data.message,
        })
      );
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Reset Password</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            id='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder='Enter new password'
          />
          <label htmlFor='newPassword'>New Password</label>
          <button
            type='button'
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm new password'
          />
          <label htmlFor='confirmPassword'>Confirm New Password</label>
          <button
            type='button'
            className={styles.passwordToggle}
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <p className={styles.instruction}>
          Password must contain at least one letter, one number, and seven
          characters.
        </p>
        <button type='submit' className={styles.submitButton}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
