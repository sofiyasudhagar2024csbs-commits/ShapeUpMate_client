import { useState, useEffect } from 'react';

const DateTimeHeader = ({ selectedDate, onDateChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDayButtons = () => {
    const days = [];
    const today = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        label: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0
      });
    }
    
    return days;
  };

  return (
    <div className="date-header">
      <div className="date-info">
        <div className="current-date">{formatDate(selectedDate || currentTime)}</div>
        <div className="current-time">{formatTime(currentTime)}</div>
      </div>
      
      <div className="day-selector">
        {getDayButtons().map((day, index) => (
          <button
            key={index}
            className={`day-btn ${day.isToday ? 'active' : ''}`}
            onClick={() => onDateChange && onDateChange(day.date)}
          >
            {day.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateTimeHeader;