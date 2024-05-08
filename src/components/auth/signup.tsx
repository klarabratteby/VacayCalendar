'use client';
import React, {useState} from 'react';
import styles from './auth.module.css'
import Button from '@/components/ui/button/button'
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {auth} from '../../lib/firebaseConfig';


export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  //Implement later
  const handleSignUp = async (e: any) => {
    try {
      if (!email || !password) {
        setError('Please enter both email and password')
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/register');
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
  };
 

  return(
    <div className={styles.loginContainer}>
       
          <form className={styles.loginForm}>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}  />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <Button onClick={handleSignUp} text="Sign Up"/>
          </form>
    </div> 

  );
}