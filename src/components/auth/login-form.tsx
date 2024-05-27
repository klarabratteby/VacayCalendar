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
import { saveUserData } from "../../lib/firestore/user";

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
      // Save user data to Firestore
      await saveUserData(uid, { email });
      router.push("/calendar");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form>
      <Link href="/register">
        <p>Register</p>
      </Link>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button
        onClick={handleSignIn}
        text="Sign in"
        backgroundColor=""
        textColor=""
      />
      <p> or </p>
      <Button
        onClick={handleGoogleAuth}
        text="Sign in with Google"
        backgroundColor=""
        textColor=""
      />
    </Form>
  );
}
