import { useState } from 'react';

const WeekNavigation = ({ currentWeek, onWeekChange }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekRange = (offset = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (offset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };

  const navigateWeek = (direction) => {
    const newOffset = weekOffset + direction;
    setWeekOffset(newOffset);
    const weekRange = getWeekRange(newOffset);
    onWeekChange && onWeekChange(weekRange);
  };

  const formatWeekRange = () => {
    const range = getWeekRange(weekOffset);
    const startMonth = range.start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = range.end.toLocaleDateString('en-US', { month: 'short' });
    const startDay = range.start.getDate();
    const endDay = range.end.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  return (
    <div className="week-navigation">
      <button className="week-nav-btn" onClick={() => navigateWeek(-1)}>
        ← Previous
      </button>
      <div className="week-display">
        {formatWeekRange()}
      </div>
      <button className="week-nav-btn" onClick={() => navigateWeek(1)}>
        Next →
      </button>
    </div>
  );
};

export default WeekNavigation;