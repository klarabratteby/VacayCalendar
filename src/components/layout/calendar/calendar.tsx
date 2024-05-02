import React from 'react'
import {Weekday,Date} from '../../../../types'
import styles from './calendar.module.css'
import {Weekdays} from '../../../configs/weekdays'
import {monthDates} from '../../../configs/monthdays';


export default function Calendar() {
  const generateDates = (date: number) => {
    for (let i=0; i<7;i++){
      //Fix component later
      return <button className="date" value={date}><p>{date}</p></button>
    }
  }
  const generateWeeks = (dates: Array<Date>) => {
    let daysInWeek = 7;
    let tempArray = [];
    for (let i=0; i < dates.length;i+= daysInWeek) {
      tempArray.push(dates.slice(i,i+daysInWeek));
    }
    return tempArray;
  }
  return (
    <div className={styles.calendarContainer}>
      <div className={styles.datepickerContainer}></div>
      <div className={styles.weekdayContainer}>
        {Weekdays.map(day => (
          <div className={styles.weekDay}>{day}</div>
        ))}
      </div>
      <div className={styles.calendar}>
        {generateWeeks(monthDates).map(week => (
          <div className={styles.week}>
            {week.map(day => (generateDates(day.day)))}
          </div>
        ))
        }
      </div>
    </div>
  )
}
