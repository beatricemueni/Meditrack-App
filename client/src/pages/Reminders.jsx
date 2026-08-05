import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

function Reminders() {
  const [remindersList, setRemindersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/reminders', { method: 'GET' })
      .then((data) => {
        if (Array.isArray(data)) {
          setRemindersList(data);
        } else if (data && Array.isArray(data.reminders)) {
          setRemindersList(data.reminders);
        } else {
          setRemindersList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reminders:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-content-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
      <div className="main-content" style={{ maxWidth: '900px', width: '100%' }}>
        
        <h1>Reminders</h1>
        <p style={{ color: '#666' }}>Never miss a critical dose window with live automated smart alerts and notification logs tracking daily routines.</p>

        {/* Conditional Layout States */}
        {loading && <p>Loading your reminders...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}. Make sure you are logged in.</p>}

        {!loading && !error && remindersList.length === 0 && (
          <p>No active reminders set for today.</p>
        )}

        {!loading && !error && remindersList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', width: '100%' }}>
            {remindersList.map((rem) => (
              <div 
                key={rem.id || rem.reminder_id} 
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  backgroundColor: rem.is_taken ? '#e8f5e9' : '#fff3e0',
                  borderLeft: rem.is_taken ? '6px solid #4caf50' : '6px solid #ff9800',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.1em', color: '#333' }}>
                     {rem.time || 'Scheduled Time'}
                  </strong>
                  <span style={{
                    fontSize: '0.8em',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: rem.is_taken ? '#c8e6c9' : '#ffe0b2',
                    color: rem.is_taken ? '#256029' : '#c66900',
                    fontWeight: 'bold'
                  }}>
                    {rem.is_taken ? 'Taken' : 'Pending'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', marginTop: '4px' }}>
                  {rem.medication_name && (
                    <p style={{ margin: 0, fontSize: '15px' }}>
                      <strong>Medication:</strong> {rem.medication_name}
                    </p>
                  )}
                  {rem.dosage_instructions && (
                    <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                      <strong>Instructions:</strong> {rem.dosage_instructions}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Reminders;
