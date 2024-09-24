import React from 'react';
import styles from '../App.module.css';

function Error({ message }) {
  return (
    <div className={styles.error}>
      <p>{message}</p>
    </div>
  );
}

export default Error;