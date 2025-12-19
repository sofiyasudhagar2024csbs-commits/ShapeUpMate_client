const ProgressBar = ({ current, goal, label }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>{label}</span>
        <span>{current} / {goal}</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;