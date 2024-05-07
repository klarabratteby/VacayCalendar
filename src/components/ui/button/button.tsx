
import styles from '../button/button.module.css'
import React from 'react';

interface Props {
  text: string;
  
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button(props: Props) {
  
  return (
    <button className={styles.primButton} onClick={props.onClick}>
      {props.text}
    </button>
  );
}