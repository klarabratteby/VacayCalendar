'use client';
import React, {useState} from 'react';
import styles from './auth.module.css'
import Button from '@/components/ui/button/button'
import {signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import router from 'next/router';
import {auth} from '../../lib/firebaseConfig';


export default function LoginForm() {
  
  //Implement later
  const handleSignIn = async () => {
  
  }

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.log(error)
    }
    //router.push('/')
    
    
  }

  return(
    <div className={styles.loginContainer}>
       
          <div className={styles.loginForm}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" />
            </div>
          
          <Button onClick={handleSignIn} text="Sign in "  />
          <p> or </p>
          <Button onClick={handleGoogleAuth} text="Sign in with Google"  />
          </div>
    </div> 

  );
}