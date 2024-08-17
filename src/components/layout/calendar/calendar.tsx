"use client";
import React, { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import AddEventForm from "@/components/event/add-event";
import { EventData } from "@/components/event/add-event";
import { VacayData } from "@/components/event/add-vacay";
import {
  saveCalendarData,
  saveVacationData,
  deleteCalendarEvent,
  editCalendarEvent,
  listenToCalendarData,
} from "@/lib/firestore/calendar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";
import ReadEventForm from "../../event/read-event";
import Button from "@/components/ui/button/button";
import VacayForm from "@/components/event/add-vacay";

interface Props {
  friendId?: string;
}

export default function Calendar({ friendId }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
  const [isOpenReadEventForm, setIsOpenReadEventForm] = useState(false);
  const [isVacayFormOpen, setIsVacayFormOpen] = useState(false);
  const [addEventFormPosition, setAddEventFormPosition] = useState<{
    top: number;
    right: number;
  }>({ top: 0, right: 0 });
  const [events, setEvents] = useState<EventData[]>([]);
  const [vacations, setVacations] = useState<
    { title: string; startDate: Date; endDate: Date }[]
  >([]);
  const [uid, setUid] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null); // holds the data of the selected event
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const id = friendId || uid;
    if (id) {
      // Listen to real-time updates for the user's or friend's calendar
      const unsubscribe = listenToCalendarData(id, (data) => {
        setEvents(data.events);
        setVacations(data.vacations);
      });
      return () => unsubscribe();
    }
  }, [friendId, uid]);

  // Function that dtermoines if user has clicked on an empty date or an event
  const openForm = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    date: Date,
    eventId: string | null = null,
    formType: "add" | "read" = "add" // Default to 'add' if not provided
  ) => {
    const calendarContainer = document.querySelector(
      `.${styles.calendarContainer}`
    );
    if (calendarContainer) {
      const rect = calendarContainer.getBoundingClientRect();
      const cellRect = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();
      const position = {
        top: cellRect.top - rect.top - cellRect.height + 40, // Position above the selected day
        right: rect.width - cellRect.right + rect.left, // Position to the left of the selected day, considering the width of the calendar
      };
      setSelectedDate(date);
      if (eventId) {
        // Find the event in the events array that matches the provided eventId
        const selectedEvent = events.find((event) => event.id === eventId);
        // set selectedEvent state to the found event
        setSelectedEvent(selectedEvent || null);
      } else {
        // empty cell date
        setSelectedEvent(null);
      }

      setIsAddEventFormOpen(formType === "add");
      setIsOpenReadEventForm(formType === "read");
      setAddEventFormPosition(position);
    }
  };

  const closeForm = () => {
    setIsAddEventFormOpen(false);
    setIsOpenReadEventForm(false);
    setIsVacayFormOpen(false);
  };

  const handleEventData = async (event: EventData) => {
    const updatedEvents: EventData[] = [...events, event];
    // If event added on a friends calendar => save on both
    if (friendId && uid) {
      await saveCalendarData(friendId, updatedEvents);
      await saveCalendarData(uid, updatedEvents);
    } else if (uid) {
      await saveCalendarData(uid, updatedEvents);
    }
  };

  const handleDeleteEvent = async () => {
    const user = auth.currentUser;
    if (user && selectedEvent?.id) {
      // Delete the event from Firestore
      await deleteCalendarEvent(selectedEvent.id);
      closeForm();
    }
  };

  const handleEdit = async (updatedEvent: EventData) => {
    const user = auth.currentUser;
    if (user && selectedEvent?.id) {
      // Update the event in Firestore
      await editCalendarEvent(updatedEvent);
      closeForm();
    }
  };

  const handleVacationData = async (vacation: VacayData[]) => {
    const id = friendId || uid;
    if (id) {
      await saveVacationData(id, vacation);
    }
  };

  const handleAddVacay = () => {
    const calendarContainer = document.querySelector(
      `.${styles.calendarContainer}`
    );
    if (calendarContainer) {
      const rect = calendarContainer.getBoundingClientRect();
      const position = {
        top: rect.top,
        right: rect.left + 20,
      };
      setIsVacayFormOpen(true);
      setAddEventFormPosition(position);
    }
  };

  const getHeader = () => {
    return (
      <div className={styles.calendarHeader}>
        <div className={styles.headerContent}>
          <div className={styles.emptyContainer}>
            <p></p>
          </div>
          <div className={styles.datepickerContainer}>
            <AiOutlineLeft
              onClick={() => setActiveDate(subMonths(activeDate, 1))}
            />
            <h2 className={styles.currentMonth}>
              {format(activeDate, "MMMM yyyy")}
            </h2>
            <AiOutlineRight
              onClick={() => setActiveDate(addMonths(activeDate, 1))}
            />
          </div>
          <div className={styles.buttonContainer}>
            {!friendId && (
              <Button
                text={vacations.length > 0 ? "Edit Vacay" : "Add Vacay"}
                backgroundColor="#DCF9E6"
                textColor="#0F574E"
                onClick={handleAddVacay}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(activeDate);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div className={styles.weekDay} key={day}>
          {format(addDays(weekStartDate, day), "E")}
        </div>
      );
    }
    return <div className={styles.weekContainer}>{weekDays}</div>;
  };

  const generateDatesForCurrentWeek = (
    date: Date,
    selectedDate: Date,
    activeDate: Date
  ) => {
    let currentDate: Date = date;
    const week: JSX.Element[] = [];
    for (let day = 0; day < 7; day++) {
      const cloneDate: Date = new Date(currentDate);
      let classNames: string = styles.date;
      if (!isSameMonth(currentDate, activeDate)) {
        classNames += " " + styles.inactiveDay;
      }

      if (isSameDay(currentDate, selectedDate)) {
        classNames += " " + styles.selectedDay;
      }

      if (isSameDay(currentDate, new Date())) {
        classNames += " " + styles.today;
      }
      vacations.forEach((vacation) => {
        if (
          currentDate >= vacation.startDate &&
          currentDate <= vacation.endDate
        ) {
          classNames += " " + styles.vacationDay; // Add a new class for vacation days
        }
      });
      // ensure that the submitted form-data gets added to the right day
      const eventsForDay = events.filter((event) =>
        isSameDay(event.date, cloneDate)
      );
      week.push(
        <div
          className={classNames}
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setSelectedDate(cloneDate);
            openForm(event, cloneDate, null, "add");
          }}
          key={day}
        >
          <span className={styles.number}>{format(currentDate, "d")}</span>
          {eventsForDay.map((event, index) => (
            <div
              key={index}
              className={styles.eventContainer}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the outer div's onClick
                openForm(e, cloneDate, event.id, "read");
              }}
            >
              <div className={styles.eventContent}>
                <div>{event.time}</div>
                <div>{event.title}</div>
              </div>
            </div>
          ))}
        </div>
      );
      currentDate = addDays(currentDate, 1);
    }
    return <>{week}</>;
  };

  const getDates = () => {
    const startOfTheSelectedMonth = startOfMonth(activeDate);
    const endOfTheSelectedMonth = endOfMonth(activeDate);
    const startDate = startOfWeek(startOfTheSelectedMonth);
    const endDate = endOfWeek(endOfTheSelectedMonth);

    let currentDate = startDate;

    const allWeeks: JSX.Element[] = [];

    while (currentDate <= endDate) {
      const weekStartDate = currentDate;
      const weekEndDate = addDays(currentDate, 6); // Calculate end date of the week
      const key = `${format(weekStartDate, "yyyy-MM-dd")}-${format(weekEndDate, "yyyy-MM-dd")}`;
      const week = generateDatesForCurrentWeek(
        currentDate,
        selectedDate,
        activeDate
      );
      allWeeks.push(
        <div key={key} className={styles.weekContainer}>
          {week}
        </div>
      );
      currentDate = addDays(currentDate, 7);
    }

    return allWeeks;
  };

  return (
    <div className={styles.calendarContainer}>
      {getHeader()}
      <div className={styles.allWeeksContainer}>
        {getWeekDaysNames()}
        {getDates()}
      </div>
      {isAddEventFormOpen && (
        <AddEventForm
          onClose={closeForm}
          onEventAdded={handleEventData}
          position={addEventFormPosition}
        />
      )}
      {isOpenReadEventForm && selectedEvent && (
        <ReadEventForm
          onClose={closeForm}
          onDeleteEvent={handleDeleteEvent}
          position={addEventFormPosition}
          eventData={selectedEvent}
          onEdit={handleEdit}
          canEdit={!friendId || selectedEvent?.id === uid}
        />
      )}
      {isVacayFormOpen && (
        <VacayForm
          onClose={closeForm}
          position={addEventFormPosition}
          addedVacay={handleVacationData}
          vacations={vacations}
        />
      )}
    </div>
  );
}
