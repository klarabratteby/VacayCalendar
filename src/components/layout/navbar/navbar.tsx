"use client";
import React from "react";
import styles from "./navbar.module.css";
import { Home, User, LogOut } from "react-feather";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "@/components/auth/signout";

export default function Navbar() {
  const pathname = usePathname();
  const { handleSignOut } = SignOut();

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        <Link href="/">
          <button className={styles.iconButton}>
            <Home />
          </button>
        </Link>
        {pathname === "/calendar" ? (
          <button className={styles.iconButton} onClick={handleSignOut}>
            <LogOut />
          </button>
        ) : (
          <Link href="/login">
            <button className={styles.iconButton}>
              <User />
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
