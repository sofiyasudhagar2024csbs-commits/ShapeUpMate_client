import { useState } from 'react';

const CalendarWidget = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button className="week-nav-btn" onClick={() => navigateMonth(-1)}>
          ←
        </button>
        <h3>{formatMonthYear()}</h3>
        <button className="week-nav-btn" onClick={() => navigateMonth(1)}>
          →
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: '600', padding: '0.5rem' }}>
            {day}
          </div>
        ))}

        {getDaysInMonth(currentMonth).map((date, index) => (
          <div
            key={index}
            className={`calendar-day ${date && isToday(date) ? 'today' : ''
              } ${date && isSelected(date) ? 'selected' : ''
              }`}
            onClick={() => date && onDateSelect && onDateSelect(date)}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;