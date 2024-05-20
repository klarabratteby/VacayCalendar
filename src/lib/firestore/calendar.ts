import { doc,setDoc,getDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {EventData} from '../../components/event/add-event';

// Save calendar data for a user
export const saveCalendarData = async (uid: string, events: EventData[]) => {
  const userRef = doc(db, 'calendars', uid);
  await setDoc(userRef, { events }, { merge: true });
}

// Fetch calendar data for a user
export const getCalendarData = async (uid: string) => {
  const userRef = doc(db, 'calendars', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data && data.events) {
      // Convert Firestore Timestamps to Date objects
      const events = data.events.map((event: any) => ({
        ...event,
        date: event.date.toDate() // Convert Timestamp to Date
      }));
      return events;
    }
  }
  return [];
}
