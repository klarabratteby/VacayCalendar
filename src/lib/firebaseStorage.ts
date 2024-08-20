import { storage } from "./firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Upload of a profile picture
export const uploadProfilePicture = async (
  file: File,
  uid: string
): Promise<string> => {
  const storageRef = ref(storage, `profile_pictures/${uid}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
