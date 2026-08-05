import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

function Prescriptions() {
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Creation States
  const [doctorName, setDoctorName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // Inline Editing States
  const [editingId, setEditingId] = useState(null);
  const [editDoctor, setEditDoctor] = useState('');
  const [editInstructions, setEditInstructions] = useState('');

  // Fetch all items on component mount
  useEffect(() => {
    let isMounted = true;
    apiFetch('/prescriptions', { method: 'GET' })
      .then((data) => {
        if (!isMounted) return;
        if (data && Array.isArray(data.prescriptions)) {
          setPrescriptionsList(data.prescriptions);
        } else if (Array.isArray(data)) {
          setPrescriptionsList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // CREATE Operation
  const handleAddPrescription = (e) => {
    e.preventDefault();
    if (!doctorName.trim() || !instructions.trim()) {
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

  // Switch card to Edit mode
  const startEdit = (presc) => {
    setEditingId(presc.id);
    setEditDoctor(presc.doctor_name || '');
    setEditInstructions(presc.instructions || '');
  };

  // UPDATE Operation
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

  // DELETE Operation
  const handleDeletePrescription = (id) => {
    if (!window.confirm('Delete this prescription note record?')) return;

    apiFetch(`/prescriptions/${id}`, { method: 'DELETE' })
      .then(() => {
        setPrescriptionsList((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Prescriptions Workspace (Full CRUD)</h1>

      {/* Log Form Area */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3>Log New Prescription</h3>
        {formMessage && <p style={{ color: formMessage.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{formMessage}</p>}
        <form onSubmit={handleAddPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Dr. Name" 
            value={doctorName} 
            onChange={(e) => setDoctorName(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            data-gramm="false"
            data-enable-grammarly="false"
          />
          <textarea 
            placeholder="Instructions" 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)} 
            style={{ padding: '8px', minHeight: '60px', borderRadius: '4px', border: '1px solid #ccc' }} 
            data-gramm="false"
            data-enable-grammarly="false"
          />
          <button type="submit" style={{ background: '#004d40', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Log Prescription</button>
        </form>
      </div>

      {/* Database View Workspace */}
      <h3>Active Database Records</h3>
      {loading && <p>Loading prescriptions...</p>}
      {error && <p style={{ color: 'red' }}>{error}. Make sure you are logged in.</p>}
      {!loading && !error && prescriptionsList.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>No prescriptions found in the database.</p>}

      <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {prescriptionsList.map((presc) => (
          <div key={presc.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* Conditional Block: View Mode vs Edit Mode */}
            {editingId === presc.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  value={editDoctor} 
                  onChange={(e) => setEditDoctor(e.target.value)} 
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  data-gramm="false"
                  data-enable-grammarly="false"
                />
                <textarea 
                  value={editInstructions} 
                  onChange={(e) => setEditInstructions(e.target.value)} 
                  style={{ padding: '6px', minHeight: '60px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  data-gramm="false"
                  data-enable-grammarly="false"
                />
              </div>
            ) : (
              <div style={{ marginBottom: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#004d40' }}>Prescription #{presc.id}</h4>
                <p style={{ margin: '3px 0' }}><strong>Doctor:</strong> {presc.doctor_name || 'Primary Care'}</p>
                <p style={{ margin: '3px 0', fontSize: '0.9em', color: '#555' }}><strong>Notes:</strong> {presc.instructions}</p>
              </div>
            )}

            {/* Actions Toolbar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px' }}>
              {editingId === presc.id ? (
                <>
                  <button onClick={() => handleUpdatePrescription(presc.id)} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ background: '#757575', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(presc)} style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Edit</button>
                  <button onClick={() => handleDeletePrescription(presc.id)} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>Delete</button>
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

