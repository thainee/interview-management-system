import React, { useEffect } from 'react';
import styles from './Homepage.module.css';
import { useDispatch } from 'react-redux';
import { setPageInfo } from '../store/uiSlice';

const Homepage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setPageInfo({
        pageName: 'Homepage',
        moduleName: '',
        moduleLink: '',
        submoduleName: '',
      })
    );
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div>
        <img src='/homepage.png' alt='Homepage' className={styles.image} />
      </div>
    </div>
  );
};

export default Homepage;
