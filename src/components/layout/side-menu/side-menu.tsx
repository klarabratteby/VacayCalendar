"use client";
import React, { useState, useEffect } from "react";
import styles from "./side-menu.module.css";
import { PlusCircle } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";
import { addFriendByEmail, getFriends } from "@/lib/firestore/friend";
import { auth } from "@/lib/firebaseConfig";

interface Props {
  onFriendSelect: (friendId: string) => void;
}

export default function SideMenu({ onFriendSelect }: Props) {
  const [showForm, setShowForm] = useState(false);
  const displayForm = () => setShowForm(!showForm);
  const [friends, setFriends] = useState<{ email: string; friendId: string }[]>(
    []
  );
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Fetches the logged in users list of friends
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
        if (!prevFriends.some((friend) => friend.email === email)) {
          return [...prevFriends, { email, friendId: "" }]; // Adding email with an empty friendId temporarily
        }
        return prevFriends;
      });
    }
  };

  const handleFriendClick = (friendId: string) => {
    onFriendSelect(friendId); // Triggers Calendar component when a friend is selected
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
          <div
            key={index}
            className={styles.friendItem}
            onClick={() => handleFriendClick(friend.friendId)}
          >
            <span>{friend.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
