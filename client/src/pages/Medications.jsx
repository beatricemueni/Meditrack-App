import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/api'; // Integrates your corrected central helper

function Medications() {
  const [medicationsList, setMedicationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form creation input states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // Inline editing track states
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDosage, setEditDosage] = useState('');
  const [editFrequency, setEditFrequency] = useState('');

  // Fetch items using stabilized apiFetch routing helper
  useEffect(() => {
    apiFetch('/medications', { method: 'GET' })
      .then((data) => {
        if (data && Array.isArray(data.data)) setMedicationsList(data.data);
        else if (Array.isArray(data)) setMedicationsList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 1. CREATE (POST)
  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!name || !dosage || !frequency) {
      setFormMessage('Please fill out all fields.');
      return;
    }

    apiFetch('/medications', {
      method: 'POST',
      body: JSON.stringify({ name, dosage, frequency })
    })
      .then((newMed) => {
        setMedicationsList((prev) => [...prev, newMed]);
        setName(''); setDosage(''); setFrequency('');
        setFormMessage('Medication saved into PostgreSQL!');
        setTimeout(() => setFormMessage(''), 3000);
      })
      .catch((err) => setFormMessage(`Error: ${err.message}`));
  };

  // Trigger Inline Editing Form
  const startEdit = (med) => {
    setEditingId(med.id);
    setEditName(med.name);
    setEditDosage(med.dosage);
    setEditFrequency(med.frequency);
  };

  // 2. UPDATE (PATCH)
  const handleUpdateMedication = (id) => {
    apiFetch(`/medications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: editName, dosage: editDosage, frequency: editFrequency })
    })
      .then((updatedMed) => {
        setMedicationsList((prev) =>
          prev.map((item) => (item.id === id ? updatedMed : item))
        );
        setEditingId(null);
      })
      .catch((err) => alert(err.message));
  };

  // 3. DELETE (DELETE)
  const handleDeleteMedication = (id) => {
    if (!window.confirm('Are you sure you want to delete this medication record?')) return;

    apiFetch(`/medications/${id}`, { method: 'DELETE' })
      .then(() => {
        setMedicationsList((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="main-content-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
      <div className="main-content" style={{ maxWidth: '900px', width: '100%', padding: '20px' }}>
        
        <h1>Medications Hub (Full CRUD)</h1>
        
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', marginBottom: '30px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '14px', color: 'var(--text)' }}>📥 Add New Medication</h3>
          {formMessage && <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{formMessage}</p>}
          <form onSubmit={handleAddMedication} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
            <input type="text" placeholder="Dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
            <input type="text" placeholder="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
            <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}>Save Medication</button>
          </form>
        </div>

        {/* ITEMS OUTPUT ITERATION ROW VIEW CONTAINER */}
        <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>📋 Current Inventory</h3>
        {loading && <p>Loading lists...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {medicationsList.map((med) => (
            <li key={med.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              
              {editingId === med.id ? (
                <div style={{ display: 'flex', gap: '8px', width: '70%' }}>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '8px', width: '33%', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <input type="text" value={editDosage} onChange={(e) => setEditDosage(e.target.value)} style={{ padding: '8px', width: '33%', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <input type="text" value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)} style={{ padding: '8px', width: '33%', borderRadius: '6px', border: '1px solid #ccc' }} />
                </div>
              ) : (
                <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong style={{ fontSize: '1.1em', color: 'var(--primary)' }}>{med.name}</strong> — {med.dosage} ({med.frequency})
                </div>
              )}

              {/* Action Buttons Row*/}
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                {editingId === med.id ? (
                  <>
                    <button onClick={() => handleUpdateMedication(med.id)} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ background: '#757575', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(med)} style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteMedication(med.id)} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                  </>
                )}
              </div>

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default Medications;
