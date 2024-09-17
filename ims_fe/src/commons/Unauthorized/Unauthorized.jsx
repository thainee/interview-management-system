import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>🚫 403 Forbidden</span>
        </div>
        <h1 className={styles.title}>Unauthorized Access</h1>
        <p className={styles.message}>
          Sorry, you don't have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>
        <Link to='/home' className={styles.link}>
          🛖 Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
