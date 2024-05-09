
import React, {} from "react"
import styles from "./navbar.module.css"
import { Home, User } from "react-feather";
import Link from "next/link"

export default function Navbar() {
  

  return(
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        <Link href="/">
        <button className={styles.iconButton}>
          <Home />
        </button>
        </Link>
        <Link href="/login">
        <button className={styles.iconButton}>
          <User />
        </button>
        </Link>
      </div>
    </nav>
  );
}


