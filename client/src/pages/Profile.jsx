import React from 'react';
import useAuth from '../hooks/useAuth';
import { User, Mail, Phone, Calendar, ShieldAlert } from 'lucide-react';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="main-content">
      {/* PROFILE WORKSPACE HEADER */}
      <div className="dashboard-header">
        <h1>Patient Profile</h1>
        <p>Manage your account settings, medical registration profiles, contact preferences, and credential details.</p>
      </div>

      
      <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
          <div className="dashboard-icon" style={{ marginBottom: 0 }}>
            <User size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>
              {user?.username || 'Account Member'}
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
              Role: {user?.role || 'User'}
            </span>
          </div>
        </div>

        
        <div style={{ display: 'flex', flexDirection: 'col', gap: '20px', marginBottom: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>Email Address</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{user?.email || 'not_provided@meditrack.com'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <Phone size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>Phone Number</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{user?.phone || '+254 700 000000'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600' }}>Age & Demographics</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{user?.age || '26'} Years Old • {user?.gender || 'Not Specified'}</p>
            </div>
          </div>

        </div>

        
        <button className="btn-primary" style={{ width: '100%' }}>
          Edit Profile Information
        </button>
      </div>
    </div>
  );
}

export default Profile;
