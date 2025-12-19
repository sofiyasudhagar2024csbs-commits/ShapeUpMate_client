const WeekNavigation = ({ currentWeek, onWeekChange }) => {
  return (
    <div className="week-navigation">
      <button className="btn btn-secondary">Previous Week</button>
      <span>Current Week</span>
      <button className="btn btn-secondary">Next Week</button>
    </div>
  );
};

export default WeekNavigation;