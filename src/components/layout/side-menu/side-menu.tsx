"use client";
import React, { useState, useEffect } from "react";
import styles from "./side-menu.module.css";
import { PlusCircle, Settings } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";
import { addFriendByEmail, getFriends } from "@/lib/firestore/friend";
import { auth } from "@/lib/firebaseConfig";
import FriendButton from "@/components/ui/button/friendbutton";
import { removeFriend } from "@/lib/firestore/friend";
import { getUserData } from "@/lib/firestore/user";
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
  const [username, setUsername] = useState<string>("");
  const [profilePicture, setProfilePicture] =
    useState<string>("/user-admin.svg");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        const userData = await getUserData(user.uid);
        if (userData) {
          setUsername(userData.username || "");
          setProfilePicture(userData.profilePicture || "/user-admin.svg");
        }
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
      <div className={styles.profilePictureContainer}>
        <img
          src={profilePicture}
          alt="Profile"
          className={styles.profilePicture}
        />
        <h1 className={styles.username}>{username}</h1>
      </div>
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
      <div className={styles.userSettingsContainer}>
        <Settings />
        <h1 className={styles.addFriendText}>SETTINGS</h1>
      </div>
    </div>
  );
}
