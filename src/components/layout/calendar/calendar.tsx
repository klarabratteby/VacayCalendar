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
import {
  saveCalendarData,
  saveVacationData,
  getCalendarData,
  deleteCalendarEvent,
  editCalendarEvent,
} from "@/lib/firestore/calendar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";
import ReadEventForm from "../../event/read-event";
import Button from "@/components/ui/button/button";
import VacayForm from "@/components/event/add-vacay";

export default function Calendar() {
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
    { startDate: Date; endDate: Date }[]
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
      if (!uid) return; // Ensure UID is available
      try {
        const calendarData = await getCalendarData(uid);
        if (calendarData) {
          setEvent(calendarData.events || []);
          setVacations(calendarData.vacations || []);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, [uid]);

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
    if (uid) {
      await saveCalendarData(uid, updatedEvents); // Save all events after adding the new one
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEventIndex === null || !uid) return;
    try {
      console.log("Selected Event Index:", selectedEventIndex); // Log selected event index
      console.log("Selected Event:", events[selectedEventIndex]);
      const afterRemove = [...events];
      afterRemove.splice(selectedEventIndex, 1);
      console.log("Events after deletion:", afterRemove);
      setEvent(afterRemove);
      await deleteCalendarEvent(uid, selectedEventIndex);
      closeForm();
    } catch (error) {
      console.error("Error handling event deletion:", error);
    }
  };

  const handleEdit = async (event: EventData) => {
    if (selectedEventIndex !== null && uid) {
      try {
        // Update Firestore
        await editCalendarEvent(uid, event, selectedEventIndex);

        // Update Calendar UI
        const updatedEvents = [...events];
        updatedEvents[selectedEventIndex] = event;
        setEvent(updatedEvents);

        // Close the edit form
        closeForm();
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  const handleVacationData = async (vacation: {
    startDate: Date;
    endDate: Date;
  }) => {
    const updatedVacations = [...vacations, vacation];
    setVacations(updatedVacations);
    if (uid) {
      await saveVacationData(uid, updatedVacations);
    }
  };

  const handleAddVacay = () => {
    console.log("handleAddVacay called");
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
            <Button
              text="Add Vacay"
              backgroundColor="#DCF9E6"
              textColor="#0F574E"
              onClick={handleAddVacay}
            />
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
        />
      )}
    </div>
  );
}
