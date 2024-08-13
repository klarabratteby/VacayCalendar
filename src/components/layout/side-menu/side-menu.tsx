"use client";
import React, { useState } from "react";
import styles from "./side-menu.module.css";
import { PlusCircle } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";

export default function SideMenu() {
  const [showForm, setShowForm] = useState(false);
  const displayForm = () => setShowForm(!showForm);
  const handleAddFriend = (email: string) => {
    setShowForm(false);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  return (
    <div className={styles.menuContainer}>
      <div className={styles.addFriendButtonContainer}>
        <h1 className={styles.addFriendText}>FRIENDS</h1>
        <PlusCircle className="addFriendButton" onClick={displayForm} />
      </div>
      {showForm && (
        <AddFriendForm
          onAddFriend={handleAddFriend}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
