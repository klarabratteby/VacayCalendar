"use client";
import React, { useState } from "react";
import styles from "./calendar-dashboard.module.css";
import Calendar from "@/components/layout/calendar/calendar";

export default function CalendarDashboard() {
  const [activeTab, setActiveTab] = useState("myCalendar"); // set default view to "My Calendar"

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className={styles.calendarDashboard}>
      <div className={styles.header}>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === "myCalendar" ? styles.activeTab : ""}`}
            onClick={() => handleTabClick("myCalendar")}
          >
            MY CALENDAR
          </button>
          <button
            className={`${styles.tab} ${activeTab === "friendsCalendar" ? styles.activeTab : ""}`}
            onClick={() => handleTabClick("friendsCalendar")}
          >
            FRIENDS CALENDAR
          </button>
        </div>
      </div>

      {activeTab === "myCalendar" && <Calendar />}
      {activeTab === "friendsCalendar" && <Calendar />}
    </div>
  );
}
