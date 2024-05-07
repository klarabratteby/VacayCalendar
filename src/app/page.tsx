import Image from "next/image";
import styles from "../app/page.module.css"
import LoginForm from "@/components/auth/login-form";

export default function Home() {
  return (

    <main className={styles.main}>

        <LoginForm />
    </main>
  );
}
