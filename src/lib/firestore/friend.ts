import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export const addFriend = async (uid: string, friendId: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    friends: arrayUnion(friendId),
  });
};

// Retrieve friend data
export const getFriendData = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && userSnap.data().friends) {
    return userSnap.data().friends;
  } else {
    return [];
  }
};
