'use client';
import React, {useState} from 'react';
import styles from './auth.module.css'
import Button from '@/components/ui/button/button'
import {signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {auth} from '../../lib/firebaseConfig';


export default function LoginForm() {
  const router = useRouter();
  
  //Implement later
  const handleSignIn = async () => {
  
  }

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/calendar');
    } catch (error) {
      console.log(error);
    }
  };

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