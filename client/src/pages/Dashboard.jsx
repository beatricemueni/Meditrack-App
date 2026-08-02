function Dashboard() {
  return (
    <div className="dashboard page">

      <div className="dashboard-header">
        <h1>Welcome to MediTrack 👋</h1>

        <p>
          Manage your medications, reminders, prescriptions, and health profile
          in one place.
        </p>
      </div>


      <div className="dashboard-grid">

        <div className="dashboard-card">

          <span className="dashboard-icon">💊</span>

          <h3>Medications</h3>

          <p>
            Track your active medicines and dosage schedules.
          </p>

          <button>
            View Medications
          </button>

        </div>



        <div className="dashboard-card">

          <span className="dashboard-icon">⏰</span>

          <h3>Reminders</h3>

          <p>
            Never miss your medication times.
          </p>

          <button>
            View Reminders
          </button>

        </div>



        <div className="dashboard-card">

          <span className="dashboard-icon">📄</span>

          <h3>Prescriptions</h3>

          <p>
            Store and manage your medical prescriptions.
          </p>

          <button>
            View Prescriptions
          </button>

        </div>



        <div className="dashboard-card">

          <span className="dashboard-icon">👤</span>

          <h3>Profile</h3>

          <p>
            Update your personal information and settings.
          </p>

          <button>
            View Profile
          </button>

        </div>

      </div>



      <div className="summary-card">

        <h2>Health Summary</h2>

        <div className="summary-grid">

          <div>
            <strong>12</strong>
            <span>Active Medicines</span>
          </div>


          <div>
            <strong>5</strong>
            <span>Today's Reminders</span>
          </div>


          <div>
            <strong>8</strong>
            <span>Prescriptions</span>
          </div>


        </div>

      </div>


    </div>
  );
}

export default Dashboard;