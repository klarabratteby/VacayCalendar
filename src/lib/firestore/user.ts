import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface UserData {
  email: string;
  username: string;
  profilePicture?: string;
}

// Create or update a users data
export const saveUserData = async (uid: string, userData: UserData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userData, { merge: true });
};

// Retrieve user data
export const getUserData = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as UserData) : null;
};
