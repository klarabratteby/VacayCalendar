import React from "react";
import styles from "./form.module.css";

interface Props {
  children: React.ReactNode;
}


export default function Form({children}: Props) {

  return(
    <div className={styles.loginContainer}>
      <form className={styles.loginForm}>
        {children}
      </form>
    </div> 

  );

}