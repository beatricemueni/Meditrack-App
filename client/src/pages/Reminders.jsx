import React, { useState, useEffect } from 'react';

function Reminders() {
  // 1. Initialize component state hooks
  const [remindersList, setRemindersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch reminders from your Flask API on component mount
  useEffect(() => {
    fetch('http://localhost:5000/reminders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Transmits your secure login token
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Handle both direct arrays or paginated data wrapper structures
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
    <div style={{ padding: '20px' }}>
      <h1>Reminders</h1>
      <p style={{ color: '#666' }}>Never miss a critical dose window with live automated smart alerts and notification logs tracking daily routines.</p>

      {/* 3. Conditional Layout States */}
      {loading && <p>Loading your reminders...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}. Make sure you are logged in.</p>}

      {/* 4. Map Loop to Output Each Reminder Notification Alert */}
      {!loading && !error && remindersList.length === 0 && (
        <p>No active reminders set for today.</p>
      )}

      {!loading && !error && remindersList.length > 0 && (
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: '20px' }}>
          {remindersList.map((rem) => (
            <div 
              key={rem.id || rem.reminder_id} 
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                backgroundColor: rem.is_taken ? '#e8f5e9' : '#fff3e0', // Green if complete, amber if pending
                borderLeft: rem.is_taken ? '6px solid #4caf50' : '6px solid #ff9800'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.1em', color: '#333' }}>
                  ⏰ {rem.time || 'Scheduled Time'}
                </strong>
                <span style={{
                  fontSize: '0.8em',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: rem.is_taken ? '#c8e6c9' : '#ffe0b2',
                  color: rem.is_taken ? '#256029' : '#c66900',
                  fontWeight: 'bold'
                }}>
                  {rem.is_taken ? 'Taken' : 'Pending'}
                </span>
              </div>

              {/* Data mappings matching your database models config */}
              <div style={{ marginTop: '10px' }}>
                {rem.medication_name && <p style={{ margin: '3px 0' }}><strong>Medication:</strong> {rem.medication_name}</p>}
                {rem.dosage_instructions && <p style={{ margin: '3px 0', fontSize: '0.9em', color: '#555' }}>{rem.dosage_instructions}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reminders;
