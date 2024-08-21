"use client";
import React, { useState } from "react";
import styles from "./calendar.module.css";
import CalendarDashboard from "@/components/layout/calendar-dashboard/calendar-dashboard";
import SideMenu from "@/components/layout/side-menu/side-menu";
import { ToastContainer } from "react-toastify";
export default function Calendar() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriend(friendId); // Updates the state with the selected friend's ID
  };
  return (
    <main className={styles.pageContent}>
      <div className={styles.pageContentWrapper}>
        <SideMenu onFriendSelect={handleFriendSelect} />
        <CalendarDashboard friendId={selectedFriend} />
        <ToastContainer position="top-right" autoClose={2000} limit={1} />
      </div>
    </main>
  );
}
