"use client"
import React, { useState } from "react";
import styles from './calendar.module.css'
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
  addMonths
} from "date-fns"
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import AddEventForm from "@/components/event/add-event";


export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
  const [addEventFormPosition, setAddEventFormPosition] = useState<{ top: number; right: number }>({ top: 0, right: 0 });


  const openAddEventForm = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Date) => {
    const calendarContainer = document.querySelector(`.${styles.calendarContainer}`);
    if (calendarContainer) {
      const rect = calendarContainer.getBoundingClientRect();
      const cellRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const position = {
        top: cellRect.top - rect.top - cellRect.height + 40, // Position above the selected day
        right: rect.width - cellRect.right + rect.left + 20, // Position to the left of the selected day, considering the width of the calendar
      };
      setIsAddEventFormOpen(true);
      setSelectedDate(date);
      setAddEventFormPosition(position);
    }
  };

  const closeAddEventForm = () => {
    setIsAddEventFormOpen(false);
  };

  const getHeader = () => {
    return (
      <div className={styles.datepickerContainer}>
        <AiOutlineLeft
          onClick={() => setActiveDate(subMonths(activeDate, 1))}
        />
        <h2 className={styles.currentMonth}>{format(activeDate, "MMMM yyyy")}</h2>
        <AiOutlineRight
          onClick={() => setActiveDate(addMonths(activeDate, 1))}
        />
        
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

  const generateDatesForCurrentWeek = (date: Date, selectedDate: Date, activeDate: Date) => {
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
      week.push(
        <div
          className={classNames}
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setSelectedDate(cloneDate);
            openAddEventForm(event, cloneDate);
          }}
          key={day}
        >
          <span className={styles.number}>{format(currentDate, "d")}</span>
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

    const allWeeks: JSX.Element[]=[];

    while (currentDate <= endDate) {
      const weekStartDate = currentDate;
      const weekEndDate = addDays(currentDate, 6); // Calculate end date of the week
      const key = `${format(weekStartDate, "yyyy-MM-dd")}-${format(weekEndDate, "yyyy-MM-dd")}`;
      const week = generateDatesForCurrentWeek(currentDate, selectedDate, activeDate);
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
      {getWeekDaysNames()}
      {getDates()}
      {isAddEventFormOpen && <AddEventForm onClose={closeAddEventForm} onEventAdded={(event) => console.log(event)} position={addEventFormPosition} />}
    </div>
  );
};

