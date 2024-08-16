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
  getCalendarData,
  deleteCalendarEvent,
  editCalendarEvent,
  getFriendCalendar,
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
  const [events, setEvent] = useState<EventData[]>([]);
  const [vacations, setVacations] = useState<
    { title: string; startDate: Date; endDate: Date }[]
  >([]);
  const [uid, setUid] = useState<string>("");
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(
    null
  ); // holds index of the currently selected event
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
    const fetchData = async () => {
      if (friendId) {
        const { events, vacations } = await getFriendCalendar(friendId);
        setEvent(events);
        setVacations(vacations);
      } else if (uid) {
        const calendarData = await getCalendarData(uid);
        if (calendarData) {
          setEvent(calendarData.events || []);
          setVacations(calendarData.vacations || []);
        }
      }
    };

    fetchData();
  }, [friendId, uid]);

  const openForm = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    date: Date,
    eventIndex: number | null = null,
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
      setSelectedEventIndex(eventIndex);

      // When an eventIndex is provided
      if (eventIndex !== null) {
        // Finds index based on date
        const selectedEventIndex = events.findIndex((event) =>
          isSameDay(event.date, date)
        );

        // If we find a date that is same as the selected date => update that index
        if (selectedEventIndex !== -1) {
          setSelectedEvent(events[selectedEventIndex]);
          setSelectedEventIndex(selectedEventIndex);
        } else {
          // If we don't find a date that is same as the selected date => set to null
          setSelectedEvent(null);
          setSelectedEventIndex(null);
        }
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
    setSelectedEventIndex(null);
  };

  const handleEventData = async (event: EventData) => {
    const updatedEvents: EventData[] = [...events, event];
    setEvent(updatedEvents);

    if (friendId && uid) {
      await saveCalendarData(friendId, updatedEvents); // Save the event to the friends calendar
      const myCalendarData = await getCalendarData(uid);
      const myUpdatedEvents: EventData[] = [
        ...(myCalendarData?.events || []),
        event,
      ];
      await saveCalendarData(uid, myUpdatedEvents);
    } else if (uid) {
      await saveCalendarData(uid, updatedEvents);
    }
  };

  const handleDeleteEvent = async () => {
    const user = auth.currentUser;
    if (user && selectedEvent?.id) {
      // Delete the event from Firestore
      await deleteCalendarEvent(selectedEvent.id);

      // Update the local state
      const updatedEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvent(updatedEvents);
      closeForm();
    }
  };

  const handleEdit = async (updatedEvent: EventData) => {
    const user = auth.currentUser;
    if (user && selectedEvent?.id) {
      // Update the event in Firestore
      await editCalendarEvent(updatedEvent);

      // Update the local state
      setEvent((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );

      closeForm();
    }
  };

  const handleVacationData = async (vacation: VacayData[]) => {
    setVacations(vacation);
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
            openForm(event, cloneDate, day, "add");
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
                openForm(e, cloneDate, index, "read");
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
