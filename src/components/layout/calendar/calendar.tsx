import React from 'react'
import {Weekday,Date} from '../../../../types'
import styles from './calendar.module.css'
import {Weekdays} from '../../../configs/weekdays'


export default function Calendar() {
  return (
    <div className={styles.calendar}>
      <div className={styles.datepickerContainer}></div>
      <div className={styles.weekdayContainer}>
        {Weekdays.map(day => (
          <div className={styles.weekDay}>{day}</div>
        ))}
      </div>
    </div>
  )
}
