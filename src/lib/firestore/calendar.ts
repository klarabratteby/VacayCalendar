import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EventData } from "../../components/event/add-event";
import { VacayData } from "../../components/event/add-vacay";

interface CalendarData {
  events: EventData[];
  vacations: VacayData[];
}
type CalendarDataCallback = (data: CalendarData) => void;

// Save calendar data for a user
export const saveCalendarData = async (
  uid: string,
  events: EventData[],
  createdBy: string
) => {
  const userRef = doc(db, "calendars", uid);
  const eventsWithIds = await Promise.all(
    events.map(async (event) => {
      if (!event.id) {
        const eventDocRef = doc(collection(db, "calendars", uid, "events"));
        event.id = eventDocRef.id;
      }
      event.createdBy = createdBy;
      return event;
    })
  );
  await setDoc(userRef, { events: eventsWithIds }, { merge: true });
};

export const saveVacationData = async (uid: string, vacations: VacayData[]) => {
  const userRef = doc(db, "calendars", uid);
  const vacationsWithIds = vacations.map((vacation) => {
    if (!vacation.id) {
      vacation.id = doc(collection(db, "calendars", uid, "vacations")).id;
    }
    return vacation;
  });
  await setDoc(userRef, { vacations: vacationsWithIds }, { merge: true });
};

export const deleteCalendarEvent = async (eventId: string) => {
  // Fetch all calendars
  const calendarsCollectionRef = collection(db, "calendars");
  const calendarsSnap = await getDocs(calendarsCollectionRef);

  // Iterate over all calendar documents
  for (const calendarDoc of calendarsSnap.docs) {
    const calendarId = calendarDoc.id;
    const userRef = doc(db, "calendars", calendarId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data && data.events) {
        // Only keep events that isnt math the eventId
        const eventsAfterDelete = data.events.filter(
          (event: EventData) => event.id !== eventId
        );

        await updateDoc(userRef, { events: eventsAfterDelete });
      }
      await deleteDoc(doc(db, "calendars", calendarId, "events", eventId));
    }
  }
};

export const editCalendarEvent = async (
  updatedEvent: EventData,
  createdBy: string
) => {
  if (!updatedEvent.id) {
    throw new Error("Event ID is required for editing");
  }
  // Fetch all calendars
  const calendarsCollectionRef = collection(db, "calendars");
  const calendarsSnap = await getDocs(calendarsCollectionRef);

  // Iterate over all calendar documents
  for (const calendarDoc of calendarsSnap.docs) {
    const calendarId = calendarDoc.id;
    const userRef = doc(db, "calendars", calendarId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      if (data && data.events) {
        // Only update events that match event id
        const updatedEvents = data.events.map((event: EventData) =>
          event.id === updatedEvent.id ? updatedEvent : event
        );
        await updateDoc(userRef, { events: updatedEvents });
      }
    }
  }
};

// Live-updates
export const listenToCalendarData = (
  uid: string,
  callback: CalendarDataCallback
) => {
  const userRef = doc(db, "calendars", uid);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      if (data) {
        const events =
          data.events?.map((event: any) => ({
            ...event,
            date: event.date.toDate(), // Convert Firestore Timestamp to Date
          })) || [];
        const vacations =
          data.vacations?.map((vacation: any) => ({
            ...vacation,
            startDate: vacation.startDate.toDate(), // Convert Firestore Timestamp to Date
            endDate: vacation.endDate.toDate(), // Convert Firestore Timestamp to Date
          })) || [];

        callback({ events, vacations });
      }
    } else {
      callback({ events: [], vacations: [] });
    }
  });
};
