import React from 'react'
import styles from './calendar.module.css'
import Filter from '@/components/layout/filter/Filter'
import CalendarDashboard from '@/components/layout/calendar-dashboard/calendar-dashboard'

export default function Calendar() {
  return (
    <main className={styles.pageContent}>
      <div className={styles.pageContentWrapper}>
        <Filter />
        <CalendarDashboard />
        
      </div>
    </main>
  );
}