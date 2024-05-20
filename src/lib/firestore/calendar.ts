import { doc,setDoc,getDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {EventData} from '../../components/event/add-event';


// Saving and updating calendar 
export const saveCalendarData = async (uid: string, eventData: EventData) => {
  const calendarRef = doc(db, 'calendars', uid);
  const calendarSnap = await getDoc(calendarRef);

  if (calendarSnap.exists()) {
    const existingEvents = calendarSnap.data().events || [];
    await updateDoc(calendarRef, {
      events: [...existingEvents, eventData]
    });
  } else {
    await setDoc(calendarRef, { events: [eventData] });
  }
};

// Fetching calendar data for a specific user
export const getCalendarData = async (uid: string): Promise<EventData[]> => {
  const calendarRef = doc(db, 'calendars', uid);
  const calendarSnap = await getDoc(calendarRef);
  return calendarSnap.exists() ? (calendarSnap.data().events as EventData[]) : [];
};
