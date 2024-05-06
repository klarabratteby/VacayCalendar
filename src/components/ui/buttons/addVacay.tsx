
import styles from '../buttons/addVacay.module.css'
import React from 'react';

interface Props {
  onClick: () => void;
}

export default function Button(props: Props) {
  
  return (
    <div className={styles.vacayButton} onClick={props.onClick}>
      
    </div>
  );
}