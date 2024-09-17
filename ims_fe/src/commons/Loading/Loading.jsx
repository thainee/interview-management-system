import React from 'react';
import styles from './Loading.module.css';

const Loading = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loading;