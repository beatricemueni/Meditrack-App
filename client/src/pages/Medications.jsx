import React, { useState, useEffect } from 'react';

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

  // Fetch items
  useEffect(() => {
    fetch('http://localhost:5000/medications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
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

    fetch('http://localhost:5000/medications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name, dosage, frequency })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create.');
        return res.json();
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
    fetch(`http://localhost:5000/medications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name: editName, dosage: editDosage, frequency: editFrequency })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed.');
        return res.json();
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

    fetch(`http://localhost:5000/medications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed.');
        // Optimistically remove from state grid map loop
        setMedicationsList((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Medications Hub (Full CRUD)</h1>
      
      {/* ADD NEW MEDICINE INPUT PANEL */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3>📥 Add New Medication</h3>
        {formMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{formMessage}</p>}
        <form onSubmit={handleAddMedication} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '8px' }} />
          <input type="text" placeholder="Dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} style={{ padding: '8px' }} />
          <input type="text" placeholder="Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ padding: '8px' }} />
          <button type="submit" style={{ background: '#004d40', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Save Medication</button>
        </form>
      </div>

      {/* ITEMS OUTPUT ITERATION ROW VIEW CONTAINER */}
      <h3>📋 Current Inventory</h3>
      {loading && <p>Loading lists...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {medicationsList.map((med) => (
          <li key={med.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '10px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingId === med.id ? (
              <div style={{ display: 'flex', gap: '8px', width: '70%' }}>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '4px', width: '30%' }} />
                <input type="text" value={editDosage} onChange={(e) => setEditDosage(e.target.value)} style={{ padding: '4px', width: '30%' }} />
                <input type="text" value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)} style={{ padding: '4px', width: '30%' }} />
              </div>
            ) : (
              <div>
                <strong style={{ fontSize: '1.1em', color: '#004d40' }}>{med.name}</strong> — {med.dosage} ({med.frequency})
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {editingId === med.id ? (
                <>
                  <button onClick={() => handleUpdateMedication(med.id)} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ background: '#757575', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(med)} style={{ background: '#0288d1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteMedication(med.id)} style={{ background: '#c62828', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Medications;

