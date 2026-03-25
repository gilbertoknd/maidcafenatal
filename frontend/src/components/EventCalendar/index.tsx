import styles from "./styles.module.css";
import type { Event } from "../../types/Event";
import { useState, useEffect } from "react";

interface EventCalendarProps {
  events: Event[];
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

export function EventCalendar({ events, selectedDate, onDateSelect, onMonthChange }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const monthName = currentDate.toLocaleString("pt-BR", { month: "long" });

  const autoSelectDayForMonth = (date: Date) => {
    if (!onDateSelect) return;
    const now = new Date();
    if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
      onDateSelect(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    } else {
      onDateSelect(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const prevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    if (onMonthChange) onMonthChange(newDate);
    autoSelectDayForMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentDate(newDate);
    if (onMonthChange) onMonthChange(newDate);
    autoSelectDayForMonth(newDate);
  };

  // Create grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    // Check if there are events on this day
    const dayEvents = events.filter((e) => {
      const eDate = new Date(e.data);
      return eDate.getDate() === day && eDate.getMonth() === month && eDate.getFullYear() === year;
    });

    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    
    // Check if this day is exactly the selectedDate
    const isSelected = selectedDate ? selectedDate.toDateString() === new Date(year, month, day).toDateString() : false;

    days.push(
      <div 
        key={day} 
        className={`${styles.day} ${isToday ? styles.today : ""} ${isSelected ? styles.selectedDay : ""} ${dayEvents.length > 0 ? styles.hasEvent : ""}`}
        onClick={() => {
          if (onDateSelect) {
            onDateSelect(new Date(year, month, day));
          }
        }}
        title="Clique para ver eventos a partir desta data"
      >
        <span className={styles.dayNumber}>{day}</span>
        {dayEvents.length > 0 && (
          <div className={styles.eventDots}>
            {dayEvents.slice(0, 3).map((e, idx) => (
              <div key={idx} className={styles.dot} title={e.titulo}></div>
            ))}
            {dayEvents.length > 3 && <span className={styles.more}>+</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navButton}>&lt;</button>
        <span className={styles.monthTitle}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}</span>
        <button onClick={nextMonth} className={styles.navButton}>&gt;</button>
      </div>
      <div className={styles.weekNames}>
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((w) => (
          <div key={w} className={styles.weekDay}>{w}</div>
        ))}
      </div>
      <div className={styles.grid}>
        {days}
      </div>
    </div>
  );
}
