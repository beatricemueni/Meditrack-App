import React, { useState, useEffect } from 'react';

function Prescriptions() {
  // 1. Initialize component state to hold data variables
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch prescriptions from your Flask backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/prescriptions', {
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
        // Handle both direct arrays or paginated data objects from Flask-RESTful
        if (Array.isArray(data)) {
          setPrescriptionsList(data);
        } else if (data && Array.isArray(data.prescriptions)) {
          setPrescriptionsList(data.prescriptions);
        } else {
          setPrescriptionsList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching prescriptions:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Prescriptions</h1>
      <p style={{ color: '#666' }}>Upload, review, and organize all formal authorization digital files assigned directly by your primary physicians.</p>

      {/* 3. Conditional Layout States */}
      {loading && <p>Loading your prescriptions...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}. Make sure you are logged in.</p>}

      {/* 4. Map Loop to Output Each Prescription Item */}
      {!loading && !error && prescriptionsList.length === 0 && (
        <p>No prescriptions found for this account layout profile.</p>
      )}

      {!loading && !error && prescriptionsList.length > 0 && (
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '20px' }}>
          {prescriptionsList.map((presc) => (
            <div 
              key={presc.id || presc.prescription_id} 
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                backgroundColor: '#fff'
              }}
            >
              {/* Note: Change 'presc.doctor_name' or 'presc.details' to match your exact Flask Model columns */}
              <h3 style={{ margin: '0 0 10px 0', color: '#004d40' }}>
                Prescription #{presc.id || presc.prescription_id}
              </h3>
              {presc.doctor_name && <p style={{ margin: '5px 0' }}><strong>Doctor:</strong> {presc.doctor_name}</p>}
              {presc.date_issued && <p style={{ margin: '5px 0' }}><strong>Date Issued:</strong> {presc.date_issued}</p>}
              {presc.instructions && <p style={{ margin: '5px 0', color: '#555' }}><strong>Instructions:</strong> {presc.instructions}</p>}
              
              {/* If your prescription object contains a nested array of its assigned medications */}
              {presc.medications && Array.isArray(presc.medications) && presc.medications.length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <strong style={{ fontSize: '0.9em', color: '#666' }}>Linked Medications:</strong>
                  <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '0.9em' }}>
                    {presc.medications.map((med, idx) => (
                      <li key={idx}>{med.name || med}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
