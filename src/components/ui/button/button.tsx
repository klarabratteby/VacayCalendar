
import styles from '../button/button.module.css'
import React from 'react';

interface Props {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?:  "button" | "submit" | "reset";
}

export default function Button({ text, onClick, type}: Props) {
  
  return (
    <button className={styles.primButton} onClick={onClick} type={type || 'button'}>
      {text}
    </button>
  );
}