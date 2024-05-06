import React from 'react';
import styles from './register-form.module.css'

export default function RegisterForm() {
  return(
    <div className={styles.loginContainer}>
          <form className={styles.loginForm}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" />
            </div>
            { /* Add button to ui folder */ }
            <button type="submit" className={styles.loginButton}>Login</button> 
          </form>
    </div> 

  );
}