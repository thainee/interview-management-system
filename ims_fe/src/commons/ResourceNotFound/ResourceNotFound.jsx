
import React from 'react';
import styles from './ResourceNotFound.module.css';

const ResourceNotFound = ({
  message = "🔍 No item matches with your search data. Please try again",
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default ResourceNotFound;