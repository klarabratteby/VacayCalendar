import React from "react";
import SignUpForm from "@/components/auth/signup";
import styles from "@/app/page.module.css";

export default function SignUpPage() {
  return (
    <main className={styles.main}>
      <SignUpForm />
    </main>
  );
}
