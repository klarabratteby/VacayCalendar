"use client";
import React, { useState, useEffect } from "react";
import styles from "./side-menu.module.css";
import { PlusCircle } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";
import { addFriendByEmail, getFriends } from "@/lib/firestore/friend";
import { auth } from "@/lib/firebaseConfig";
import FriendButton from "@/components/ui/button/friendbutton";
import { removeFriend } from "@/lib/firestore/friend";
interface Props {
  onFriendSelect: (friendId: string) => void;
}

export default function SideMenu({ onFriendSelect }: Props) {
  const [showForm, setShowForm] = useState(false);
  const displayForm = () => setShowForm(!showForm);
  const [friends, setFriends] = useState<
    { username: string; email: string; friendId: string }[]
  >([]);
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
      const friendsList = await getFriends(uid);
      setFriends(friendsList);
    }
  };

  const handleFriendClick = (friendId: string) => {
    onFriendSelect(friendId); // Triggers Calendar component when a friend is selected
  };

  const handleDeleteFriend = async (friendId: string) => {
    if (uid) {
      await removeFriend(uid, friendId);
      const friendsList = await getFriends(uid);
      setFriends(friendsList);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className={styles.menuContainer}>
      <div className={styles.friendListContainer}>
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
            <FriendButton
              key={index}
              text={friend.username}
              onClick={() => handleFriendClick(friend.friendId)}
              onDeleteClick={() => handleDeleteFriend(friend.friendId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
