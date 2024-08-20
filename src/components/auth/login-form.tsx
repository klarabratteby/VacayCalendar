"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./auth.module.css";
import Button from "@/components/ui/button/button";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseConfig";
import Link from "next/link";
import Form from "@/components/ui/form/form";
import { getUserData, saveUserData } from "../../lib/firestore/user";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //Implement later
  const handleSignIn = async (e: any) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/calendar");
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
  };

  const handleGoogleAuth = async (e: any) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const uid = userCredential.user.uid;
      // Extract user's email and handle null case
      const email = userCredential.user.email || "";

      const existingUserData = await getUserData(uid);

      if (!existingUserData?.username) {
        // Prompt for username if it doesn't exist
        let username = "";
        while (!username) {
          username = prompt("Please enter a username:") || "";
          if (username) {
            // Save user data to Firestore
            await saveUserData(uid, { email, username });
          } else {
            alert("Username is required to continue.");
          }
        }
      }
      router.push("/calendar");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form>
      <div className={styles.authHeadline}>
        <h1>Login To Your Account</h1>
      </div>
      <div className={styles.dividerContainer}>
        <div className={styles.registerContainer}>
          <p>Don&apos;t have an account?</p>
          <Link href="/register">
            <p>Register</p>
          </Link>
        </div>

        <div className={styles.divider}>
          <span className={styles.line}></span>

          <span className={styles.line}></span>
        </div>

        <Button
          onClick={handleGoogleAuth}
          text="Sign in with Google"
          backgroundColor="#0C463F"
          textColor="fff"
          width="13rem"
        />

        <div className={styles.divider}>
          <span className={styles.line}></span>
          <p className={styles.loginOptionText}>OR</p>
          <span className={styles.line}></span>
        </div>

        <div className={styles.formInputContainer}>
          <div className={styles.formInput}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formInput}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.signInButton}>
          <Button
            onClick={handleSignIn}
            text="Sign in"
            backgroundColor="#0C463F"
            textColor="fff"
            width="13rem"
          />
        </div>
      </div>
    </Form>
  );
}
