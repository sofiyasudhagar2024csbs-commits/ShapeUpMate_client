import { useState, useEffect } from 'react';
import { trainers } from '../services/api';

const TrainerSelection = () => {
  const [trainerList, setTrainerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [assignedTrainer, setAssignedTrainer] = useState(null);

  useEffect(() => {
    fetchTrainers();
    checkAssignedTrainer();
  }, []);

  const checkAssignedTrainer = () => {
    const savedTrainer = localStorage.getItem('assignedTrainer');
    if (savedTrainer) {
      setAssignedTrainer(savedTrainer);
      setSelectedTrainer(savedTrainer);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await trainers.getAll();
      setTrainerList(response.data);
    } catch (error) {
      console.error('Error fetching nutritionists:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignTrainer = async (trainerId) => {
    try {
      await trainers.assign(trainerId);
      setSelectedTrainer(trainerId);
      setAssignedTrainer(trainerId);
      localStorage.setItem('assignedTrainer', trainerId);
      alert('Nutritionist assigned successfully!');
    } catch (error) {
      alert('Error assigning nutritionist');
    }
  };

  if (loading) return <div>Loading nutritionists...</div>;

  return (
    <div className="container">
      <h2>{assignedTrainer ? 'Your Assigned Nutritionist' : 'Select Your Nutritionist'}</h2>
      {assignedTrainer && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '1rem', color: 'black' }}>
          ✅ You have already selected a nutritionist. You can change your selection below if needed.
        </div>
      )}

      <div className="feature-grid">
        {trainerList.map(trainer => (
          <div key={trainer._id} className="card">
            <h3>{trainer.name}</h3>
            <p><strong>Email:</strong> {trainer.email}</p>
            {trainer.specialization && (
              <p><strong>Specialization:</strong> {trainer.specialization}</p>
            )}
            {trainer.experience && (
              <p><strong>Experience:</strong> {trainer.experience} years</p>
            )}
            {trainer.certification && (
              <p><strong>Certification:</strong> {trainer.certification}</p>
            )}
            {trainer.phone && (
              <p><strong>Phone:</strong> {trainer.phone}</p>
            )}
            <button
              className={`btn ${assignedTrainer === trainer._id ? 'btn-success' : 'btn-primary'}`}
              onClick={() => assignTrainer(trainer._id)}
            >
              {assignedTrainer === trainer._id ? '✅ Currently Assigned' : 'Select Nutritionist'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerSelection;