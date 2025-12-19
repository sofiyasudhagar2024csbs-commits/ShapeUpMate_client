const DateTimeHeader = ({ selectedDate, onDateChange }) => {
  return (
    <div className="date-header">
      <div className="date-info">
        <div className="current-date">
          {selectedDate.toLocaleDateString()}
        </div>
        <div className="current-time">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default DateTimeHeader;