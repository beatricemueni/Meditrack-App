import React, { useState, useEffect } from 'react';

function Medications() {
  // 1. Initialize state to hold your medications list array
  const [medicationsList, setMedicationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the medications from your Flask backend upon page mount
  useEffect(() => {
    fetch('http://localhost:5000/medications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Adds the required security token
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // 💡 FIX: Your backend explicitly nests the array inside data.data 
        if (data && Array.isArray(data.data)) {
          setMedicationsList(data.data);
        } else if (Array.isArray(data)) {
          setMedicationsList(data);
        } else {
          setMedicationsList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medications:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Medications</h1>
      <p>Medication management page</p>

      {/* 3. Conditional Layout States */}
      {loading && <p>Loading your medications...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}. Make sure you are logged in.</p>}

      {/* 4. Map Loop to Output Each Medication Item */}
      {!loading && !error && medicationsList.length === 0 && (
        <p>No medications found for this account layout profile.</p>
      )}

      {!loading && !error && medicationsList.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {medicationsList.map((med) => (
            <li 
              key={med.id || med.medication_id} 
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                maxWidth: '400px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0', color: '#004d40' }}>{med.name}</h3>
              {med.dosage && <p style={{ margin: '0' }}><strong>Dosage:</strong> {med.dosage}</p>}
              {med.frequency && <p style={{ margin: '0' }}><strong>Frequency:</strong> {med.frequency}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Medications;
