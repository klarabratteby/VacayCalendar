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
            <p className={styles.link}>Register</p>
          </Link>
        </div>

        <div className={styles.divider}>
          <span className={styles.line}></span>

          <span className={styles.line}></span>
        </div>

        <button className={styles.gsiMaterialButton} onClick={handleGoogleAuth}>
          <div className={styles.gsiMaterialButtonState}></div>
          <div className={styles.gsiMaterialButtonContentWrapper}>
            <div className={styles.gsiMaterialButtonIcon}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{ display: "block" }}
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className={styles.gsiMaterialButtonContents}>
              Sign in with Google
            </span>
            <span style={{ display: "none" }}>Sign in with Google</span>
          </div>
        </button>

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
