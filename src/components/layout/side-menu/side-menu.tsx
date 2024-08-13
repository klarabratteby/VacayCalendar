"use client";
import React, { useState } from "react";
import styles from "./side-menu.module.css";
import { PlusCircle } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";
import { addFriendByEmail } from "@/lib/firestore/friend";
import { auth } from "@/lib/firebaseConfig";

export default function SideMenu() {
  const [showForm, setShowForm] = useState(false);
  const displayForm = () => setShowForm(!showForm);
  const [friends, setFriends] = useState<string[]>([]);

  const handleAddFriend = async (email: string) => {
    setShowForm(false);

    const currentUser = auth.currentUser;
    if (currentUser) {
      const uid = currentUser.uid;
      try {
        await addFriendByEmail(uid, email);
        setFriends((prevFriends) => [...prevFriends, email]);
        console.log("Friend added");
      } catch (error) {
        console.error("Error adding friend", error);
      }
    }
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
      <div className={styles.friendsList}>
        {friends.map((friend, index) => (
          <div key={index} className={styles.friendItem}>
            <span>{friend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
