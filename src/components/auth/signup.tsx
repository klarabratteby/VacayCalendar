"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/button";
import Form from "@/components/ui/form/form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseConfig";
import { saveUserData } from "@/lib/firestore/user";
import styles from "./auth.module.css";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    try {
      if (!email || !password || !username) {
        setError("Please enter username, email and password");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user?.uid;
      if (!uid) {
        setError("Failed to create user");
        return;
      }
      const userEmail = userCredential.user?.email ?? "";
      await saveUserData(uid, { email: userEmail, username });
      router.push("/login");
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <Form>
      <div className={styles.dividerContainer}>
        <div className={styles.authHeadline}>
          <h1>Signup to an Account</h1>
        </div>

        <div className={styles.formInputContainer}>
          <div className={styles.formInput}>
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Name"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p>{error}</p>}
        <div className={styles.signInButton}>
          <Button
            onClick={handleSignUp}
            text="Sign Up"
            backgroundColor="#0C463F"
            textColor="fff"
            width="13rem"
          />
        </div>
      </div>
    </Form>
  );
}
