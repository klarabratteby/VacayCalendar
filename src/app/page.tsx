import Image from "next/image";
import styles from "../app/page.module.css"
import RegisterForm from "@/components/layout/forms/register-form";

export default function Home() {
  return (

    <main className={styles.main}>

        <RegisterForm />
    </main>
  );
}
