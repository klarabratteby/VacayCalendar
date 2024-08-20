"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./side-menu.module.css";
import { PlusCircle } from "react-feather";
import AddFriendForm from "@/components/ui/form/add-friend-form";
import { addFriendByEmail, getFriends } from "@/lib/firestore/friend";
import { auth } from "@/lib/firebaseConfig";
import FriendButton from "@/components/ui/button/friendbutton";
import { removeFriend } from "@/lib/firestore/friend";
import { getUserData, saveUserData } from "@/lib/firestore/user";
import { uploadProfilePicture } from "@/lib/firebaseStorage";
import { IoAddCircle } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";

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
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        const userData = await getUserData(user.uid);
        if (userData) {
          setUsername(userData.username || "");
          setProfilePicture(userData.profilePicture || "/user-admin.svg");
          setEmail(userData.email);
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

  const handleUploadProfilePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0] && uid) {
      const file = event.target.files[0];

      try {
        // Upload the new profile picture
        const downloadURL = await uploadProfilePicture(file, uid);

        // Update the user's profile picture in Firestore
        await saveUserData(uid, {
          email,
          username,
          profilePicture: downloadURL,
        });
        setProfilePicture(downloadURL);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

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
        <div className={`${styles.headline} playwrite-co`}>
          Let&apos;s Plan!
        </div>
        <div className={styles.profilePictureWrapper}>
          <Image
            src={profilePicture}
            alt="Profile"
            className={styles.profilePicture}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadProfilePicture}
            className={styles.uploadInput}
          />
          <IoAddCircle
            className={styles.addProfilePictureButton}
            onClick={() => {
              const fileInput = document.querySelector(
                `.${styles.uploadInput}`
              ) as HTMLInputElement;
              fileInput?.click();
            }}
          />
        </div>
        <h1 className={styles.username}>{username}</h1>
      </div>
      <div className={styles.friendListContainer}>
        <div className={styles.addFriendButtonContainer}>
          <h2 className={styles.addFriendText}>Friends</h2>
          <IoPersonAdd
            className={styles.addFriendButton}
            onClick={displayForm}
          />
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
