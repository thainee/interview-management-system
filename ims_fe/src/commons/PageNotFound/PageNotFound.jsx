import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PageNotFound.module.css';

const PageNotFound = ({ message = "😓Oops! The page you're looking for doesn't exist.", linkTo = "/home" }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>{message}</p>
        <div className={styles.icon}>🔍</div>
        <Link to={linkTo} className={styles.link}>
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;