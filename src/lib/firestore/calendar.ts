import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EventData } from "../../components/event/add-event";

// Save calendar data for a user
export const saveCalendarData = async (uid: string, events: EventData[]) => {
  const userRef = doc(db, "calendars", uid);
  await setDoc(userRef, { events }, { merge: true });
};

export const saveVacationData = async (
  uid: string,
  vacations: { startDate: Date; endDate: Date }[]
) => {
  const userRef = doc(db, "calendars", uid);
  // Convert Date objects to Firestore Timestamps
  const formattedVacations = vacations.map((vacation) => ({
    startDate: vacation.startDate,
    endDate: vacation.endDate,
  }));
  await setDoc(userRef, { vacations: formattedVacations }, { merge: true });
};

// Fetch calendar data for a user
export const getCalendarData = async (uid: string) => {
  const userRef = doc(db, "calendars", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data) {
      const events =
        data.events?.map((event: any) => ({
          ...event,
          date: event.date.toDate(), // Convert Firestore Timestamp to Date
        })) || [];
      const vacations =
        data.vacations?.map((vacation: any) => ({
          startDate: vacation.startDate.toDate(), // Convert Firestore Timestamp to Date
          endDate: vacation.endDate.toDate(), // Convert Firestore Timestamp to Date
        })) || [];
      return { events, vacations };
    }
  }
  return { events: [], vacations: [] };
};

export const deleteCalendarEvent = async (
  uid: string,
  selectedEventIndex: number
) => {
  const userRef = doc(db, "calendars", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data && data.events) {
      // Filter out the selected event based on index
      const eventsAfterDelete = [...data.events];
      eventsAfterDelete.splice(selectedEventIndex, 1);
      await updateDoc(userRef, { events: eventsAfterDelete });
      return eventsAfterDelete;
    }
  }
};

export const editCalendarEvent = async (
  uid: string,
  updatedEvent: EventData,
  selectedIndex: number
) => {
  const userRef = doc(db, "calendars", uid);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data && data.events) {
        const updatedEvents = [...data.events];
        updatedEvents[selectedIndex] = updatedEvent;
        await updateDoc(userRef, { events: updatedEvents });
        return updatedEvent;
      }
    }
  } catch (error) {
    console.error("Error editing event:", error);
    throw error;
  }
};
