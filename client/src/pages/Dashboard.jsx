import React from 'react';
import useAuth from '../hooks/useAuth';
import { Pill, Bell, Calendar, ArrowRight, Activity, FileCheck } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();

  // Custom data states or metrics fallbacks
  const stats = {
    activeMedicines: 12,
    todaysReminders: 5,
    prescriptions: 8
  };

  return (
    <div className="main-content">
      
      {/* RICH GRADIENT WELCOME HEADER */}
      <div className="dashboard-header">
        <h1>Welcome Back, {user?.username || 'User'}!</h1>
        <p>Manage your medications, reminders, prescriptions, and health profile all in one central workspace.</p>
      </div>

      {/* THREE-COLUMN DIRECTORY NAV GRID */}
      <div className="dashboard-grid">
        
        {/* Medications Feature Card */}
        <div className="dashboard-card">
          <div className="dashboard-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Pill size={24} />
          </div>
          <h3>Active Medications</h3>
          <p>Keep track of your current active prescriptions and complex daily dosage schedules without friction.</p>
          <a href="/medications" className="btn-primary">
            Manage List <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </a>
        </div>

        {/* Reminders Feature Card */}
        <div className="dashboard-card">
          <div className="dashboard-icon" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--warning)' }}>
            <Bell size={24} />
          </div>
          <h3>Patient Reminders</h3>
          <p>Never miss a critical dose window with live automated smart alerts and notification logs tracking daily routines.</p>
          <a href="/reminders" className="btn-primary">
            Manage More <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </a>
        </div>

        {/* Appointment / Prescriptions Feature Card */}
        <div className="dashboard-card">
          <div className="dashboard-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
            <Calendar size={24} />
          </div>
          <h3>Prescriptions Profile</h3>
          <p>Upload, review, and organize all formal authorization digital files assigned directly by your primary physicians.</p>
          <a href="/prescriptions" className="btn-primary">
            Manage Monitor <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </a>
        </div>

      </div>

      {/* HEALTH SUMMARY METRICS GRID */}
      <section className="summary-card">
        <h2>Health Summary</h2>
        <div className="summary-grid">
          <div>
            <strong>{stats.activeMedicines}</strong>
            <span>Active Medicines</span>
            <div style={{ position: 'absolute', right: '16px', bottom: '16px', opacity: 0.15, color: 'var(--primary)' }}>
              <Pill size={32} />
            </div>
          </div>
          <div>
            <strong>{stats.todaysReminders}</strong>
            <span>Today's Reminders</span>
            <div style={{ position: 'absolute', right: '16px', bottom: '16px', opacity: 0.15, color: 'var(--warning)' }}>
              <Bell size={32} />
            </div>
          </div>
          <div>
            <strong>{stats.prescriptions}</strong>
            <span>Prescriptions</span>
            <div style={{ position: 'absolute', right: '16px', bottom: '16px', opacity: 0.15, color: 'var(--success)' }}>
              <FileCheck size={32} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
