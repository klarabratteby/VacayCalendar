import { db } from "../firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  collection,
  query,
  where,
  getDoc,
} from "firebase/firestore";

// Allows a logged in user (uid) to add another user (friendId)
export const addFriend = async (uid: string, friendId: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    friends: arrayUnion(friendId),
  });
};

// Retrieve friend data through email
export const addFriendByEmail = async (uid: string, email: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnap = await getDocs(q);

  // Check if a user with the provided email was found
  if (!querySnap.empty) {
    const friendId = querySnap.docs[0].id;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    // Modify the logged-in persons friends list
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentFriends: string[] = userData.friends || [];

      // Check if the added friend is already in the friend list
      if (!currentFriends.includes(friendId)) {
        await updateDoc(userRef, {
          friends: arrayUnion(friendId),
        });
        // Also add the logged-in user to the other person's list
        const friendRef = doc(db, "users", friendId);
        await updateDoc(friendRef, {
          friends: arrayUnion(uid),
        });
      }
    }
  }
};

// Retrieves current friends list
export const getFriends = async (
  uid: string
): Promise<{ email: string; friendId: string }[]> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const friendIds: string[] = userData.friends || [];

    const friends: { email: string; friendId: string }[] = [];
    for (const friendId of friendIds) {
      const friendRef = doc(db, "users", friendId);
      const friendSnap = await getDoc(friendRef);

      if (friendSnap.exists()) {
        const friendData = friendSnap.data();
        friends.push({ email: friendData.email, friendId });
      }
    }
    return friends; // email and friendId
  }
  return [];
};
