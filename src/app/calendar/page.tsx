import React from "react";
import styles from "./calendar.module.css";
import CalendarDashboard from "@/components/layout/calendar-dashboard/calendar-dashboard";
import SideMenu from "@/components/layout/side-menu/side-menu";

export default function Calendar() {
  return (
    <main className={styles.pageContent}>
      <div className={styles.pageContentWrapper}>
        <SideMenu />
        <CalendarDashboard />
      </div>
    </main>
  );
}
