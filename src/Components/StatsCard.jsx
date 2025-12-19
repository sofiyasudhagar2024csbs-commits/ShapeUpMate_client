const StatsCard = ({ number, label, icon, trend, color = '#667eea' }) => {
  return (
    <div className="stat-card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
        {trend && (
          <span className={`badge badge-${trend > 0 ? 'success' : 'danger'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <span className="stat-number" style={{ color }}>{number}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default StatsCard;