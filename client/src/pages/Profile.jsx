import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { User, Mail, Phone, Calendar, Loader2, Check } from 'lucide-react';

function Profile() {
  const { user } = useAuth();
  
  // 1. Manage state variables for async layout operations
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form input field elements bindings
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // 2. Fetch specific profile entity details from your Flask API
  useEffect(() => {
    fetch('http://localhost:5000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load registration profile records.");
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        // Pre-populate input states matching relational model keys
        setPhone(data.phone || '');
        setAge(data.age || '');
        setGender(data.gender || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 3. Process backend updates via a PATCH method block
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    fetch('http://localhost:5000/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        phone: phone,
        age: parseInt(age) || null,
        gender: gender
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to patch user profile entries.");
        return res.json();
      })
      .then((updatedData) => {
        setProfileData(updatedData);
        setIsEditing(false);
        setSaving(false);
        setSuccessMsg('Profile records updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)' }} />
        <p style={{ marginLeft: '10px' }}>Loading registration profile data...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h1>Patient Profile</h1>
        <p>Manage your account settings, medical registration profiles, contact preferences, and credential details.</p>
      </div>

      <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        {/* PROFILE HEADER WRAPPER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
          <div className="dashboard-icon" style={{ marginBottom: 0, backgroundColor: 'var(--primary-light)', padding: '12px', borderRadius: '50%' }}>
            <User size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
              {user?.username || 'Account Member'}
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
              Role: {user?.role || 'User'}
            </span>
          </div>
        </div>

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: '600' }}>
            <Check size={16} /> {successMsg}
          </div>
        )}

        {/* CONDITIONALLY RENDER EDIT VIEW VS RAW DETAIL GRID */}
        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600', margin: 0 }}>Email Address</p>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>{user?.email || 'not_provided@meditrack.com'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <Phone size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600', margin: 0 }}>Phone Number</p>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>{profileData?.phone || 'No phone recorded'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <Calendar size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600', margin: 0 }}>Age & Demographics</p>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
                    {profileData?.age ? `${profileData.age} Years Old` : 'Age Unspecified'} • {profileData?.gender || 'Gender Unspecified'}
                  </p>
                </div>
              </div>

            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setIsEditing(true)}>
              Edit Profile Information
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveChanges}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', marginBottom: '6px' }}>Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }} placeholder="+254 700 000000" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', marginBottom: '6px' }}>Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }} placeholder="26" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', marginBottom: '6px' }}>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', backgroundColor: '#fff' }}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', cursor: 'pointer' }} onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={saving}>
                {saving ? 'Saving changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
