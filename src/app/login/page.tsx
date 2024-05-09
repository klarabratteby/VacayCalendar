import React from 'react'
import styles from '@/app/page.module.css';
import LoginForm from '@/components/auth/login-form';

export default function Calendar() {
  return (
    <main className={styles.main}>
        <LoginForm /> 
        
    </main>
  );
}