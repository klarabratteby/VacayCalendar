import React from "react";
import styles from "./form.module.css";

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
}


export default function Form({children,header}: Props) {

  return(
    
    <div className={styles.formContainer}>
      {header && <div className={styles.formHeader}>
        {header}
      </div>}
      <div className={styles.formContent}>
        <form className={styles.loginForm}>
          {children}
        </form>
      </div>
    </div> 

  );

}