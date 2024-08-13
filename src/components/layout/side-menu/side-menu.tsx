"use client";
import React, { useState, useEffect } from "react";
import styles from "./side-menu.module.css";
import { PlusCircle } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";
import { addFriendByEmail, getFriends } from "@/lib/firestore/friend";
import { auth } from "@/lib/firebaseConfig";

export default function SideMenu() {
  const [showForm, setShowForm] = useState(false);
  const displayForm = () => setShowForm(!showForm);
  const [friends, setFriends] = useState<string[]>([]);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!uid) return;
      const friendsList = await getFriends(uid);
      setFriends(friendsList);
    };

    fetchFriends();
  }, [uid]);

  const handleAddFriend = async (email: string) => {
    setShowForm(false);

    if (uid) {
      await addFriendByEmail(uid, email);
      // Update the state only if the friend is not already in the list
      setFriends((prevFriends) => {
        if (!prevFriends.includes(email)) {
          return [...prevFriends, email];
        }
        return prevFriends;
      });
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
