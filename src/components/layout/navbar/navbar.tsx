import React, {} from "react"
import styles from "./navbar.module.css"
import { Home } from "react-feather";

export default function Navbar() {
  return(
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        <button className={styles.iconButton}>
        <Home />
        </button>
      </div>
    </nav>
  );
}


