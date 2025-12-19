import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{type === 'success' ? '✓' : '✗'}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;