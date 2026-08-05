import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

function Prescriptions() {
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [doctorName, setDoctorName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editDoctor, setEditDoctor] = useState('');
  const [editInstructions, setEditInstructions] = useState('');

  useEffect(() => {
    apiFetch('/prescriptions', { method: 'GET' })
      .then((data) => {
        if (data && Array.isArray(data.prescriptions)) {
          setPrescriptionsList(data.prescriptions);
        } else if (Array.isArray(data)) {
          setPrescriptionsList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddPrescription = (e) => {
    e.preventDefault();
    if (!doctorName || !instructions) {
      setFormMessage('Please input both the doctor name and instructions.');
      return;
    }

    apiFetch('/prescriptions', {
      method: 'POST',
      body: JSON.stringify({ doctor_name: doctorName, instructions: instructions })
    })
      .then((newPresc) => {
        setPrescriptionsList((prev) => [...prev, newPresc]);
        setDoctorName(''); 
        setInstructions('');
        setFormMessage('Prescription written to PostgreSQL!');
        setTimeout(() => setFormMessage(''), 3000);
      })
      .catch((err) => setFormMessage(`Error: ${err.message}`));
  };

  const startEdit = (presc) => {
    setEditingId(presc.id);
    setEditDoctor(presc.doctor_name || '');
    setEditInstructions(presc.instructions || '');
  };

  const handleUpdatePrescription = (id) => {
    apiFetch(`/prescriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ doctor_name: editDoctor, instructions: editInstructions })
    })
      .then((updatedPresc) => {
        setPrescriptionsList((prev) =>
          prev.map((item) => (item.id === id ? updatedPresc : item))
        );
        setEditingId(null);
      })
      .catch((err) => alert(err.message));
  };

  const handleDeletePrescription = (id) => {
    if (!window.confirm('Delete this prescription note record?')) return;

    apiFetch(`/prescriptions/${id}`, { method: 'DELETE' })
      .then(() => {
        setPrescriptionsList((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Prescriptions Workspace (Full CRUD)</h1>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3>📝 Log New Prescription</h3>
        {formMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{formMessage}</p>}
        <form onSubmit={handleAddPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Dr. Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={{ padding: '8px' }} />
          <textarea placeholder="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} style={{ padding: '8px', minHeight: '60px' }} />
          <button type="submit" style={{ background: '#004d40', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Log Prescription</button>
        </form>
      </div>

      <h3>📜 Active Database Files</h3>
      {loading && <p>Loading tracks...</p>}
      {error && <p style={{ color: 'red' }}>{error}. Make sure you are logged in.</p>}

      <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {prescriptionsList.map((presc) => (
          <div key={presc.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {editingId === presc.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <input type="text" value={editDoctor} onChange={(e) => setEditDoctor(e.target.value)} style={{ padding: '4px' }} />
                <textarea value={editInstructions} onChange={(e) => setEditInstructions(e.target.value)} style={{ padding: '4px', minHeight: '60px' }} />
              </div>
            ) : (
              <div style={{ marginBottom: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#004d40' }}>Prescription #{presc.id}</h4>
                <p style={{ margin: '3px 0' }}><strong>Doctor:</strong> {presc.doctor_name || 'Primary Care'}</p>
                <p style={{ margin: '3px 0', fontSize: '0.9em', color: '#555' }}><strong>Notes:</strong> {presc.instructions}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              {editingId === presc.id ? (
                <>
                  <button onClick={() => handleUpdatePrescription(presc.id)} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ background: '#757575', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(presc)} style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Edit</button>
                  <button onClick={() => handleDeletePrescription(presc.id)} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prescriptions;
