import { useState, useEffect } from 'react';
import { trainers } from '../services/api';

const Guidance = () => {
  const [guidanceList, setGuidanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuidance();
  }, []);

  const fetchGuidance = async () => {
    try {
      const response = await trainers.getGuidance();
      setGuidanceList(response.data);
    } catch (error) {
      console.error('Error fetching guidance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading nutrition plans...</div>;

  return (
    <div className="container">
      <h2>My Nutrition Plans</h2>
      
      {guidanceList.length === 0 ? (
        <div className="card">
          <p>No nutrition plans available yet. Please select a nutritionist first.</p>
        </div>
      ) : (
        <div className="feature-grid">
          {guidanceList.map(guidance => (
            <div key={guidance._id} className="card">
              <div className="feature-icon icon-success">
                {guidance.type === 'meal' ? '🍎' : '💪'}
              </div>
              <h3>{guidance.type === 'meal' ? 'Meal Plan' : 'Exercise Plan'}</h3>
              <p><strong>From:</strong> {guidance.trainerId.name}</p>
              <p>{guidance.description}</p>
              <small>Created: {new Date(guidance.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Guidance;