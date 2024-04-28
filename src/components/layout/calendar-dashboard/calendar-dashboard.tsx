import styles from './calendar-dashboard.module.css'
import Calendar from '@/components/layout/calendar/calendar'

export default function CalendarDashboard() {
  return(
    <div className={styles.calendarDashboard}>
      <Calendar />
      </div>

  );
}