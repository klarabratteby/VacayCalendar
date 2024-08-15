"use client";
import React, { useState } from "react";
import styles from "./auth.module.css";
import Button from "@/components/ui/button/button";
import Form from "@/components/ui/form/form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseConfig";
import { saveUserData } from "@/lib/firestore/user";

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
      <div>
        <label htmlFor="username">Name</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
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
        onClick={handleSignUp}
        text="Sign Up"
        backgroundColor="#031D44"
        textColor="fff"
      />
    </Form>
  );
}
