const ProgressBar = ({ current, goal, label }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{label}</span>
        <span style={{ fontSize: '0.9rem', color: '#718096' }}>
          {current}/{goal}
        </span>
      </div>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;