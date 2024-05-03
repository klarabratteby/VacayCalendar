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
import Button from '@/components/ui/buttons/addVacay'

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date());

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
        <Button onClick={() => {

        }}/>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(activeDate); 
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div className={styles.weekDay}>
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
          onClick={() => {
            setSelectedDate(cloneDate);
          }}
          key={day}
        >
          {format(currentDate, "d")}
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
      allWeeks.push(
        generateDatesForCurrentWeek(currentDate, selectedDate, activeDate)
      );
      currentDate = addDays(currentDate, 7);
    }

    return (<div className={styles.weekContainer}>{allWeeks}</div>);
  };

  return (
    
    <div className={styles.calendarContainer}>
      {getHeader()}
      {getWeekDaysNames()}
      {getDates()}
    </div>
  );
};

