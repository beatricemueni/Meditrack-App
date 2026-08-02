

function Profile() {
  const user = {
    name: "",
    email: "",
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>

          <div>
            <h1>{user.name}</h1>
            <p>Patient Profile</p>
          </div>
        </div>


        <div className="profile-details">

          <div className="detail-box">
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>

          <div className="detail-box">
            <h3>Phone</h3>
            <p>{user.phone}</p>
          </div>

          <div className="detail-box">
            <h3>Age</h3>
            <p>{user.age} years</p>
          </div>

          <div className="detail-box">
            <h3>Gender</h3>
            <p>{user.gender}</p>
          </div>

        </div>


        <button className="edit-btn">
          Edit Profile
        </button>

      </div>

    </div>
  );
}

export default Profile;