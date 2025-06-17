const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <>
    <style>
        {
            `
            .profile-container {
  padding: 60px 0;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.profile-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.4s ease-in-out;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.role-badge {
  display: inline-block;
  background-color: #ffba5a;
  color: white;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 13px;
  margin-top: 8px;
}

.profile-body h4 {
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #555;
}

.btn {
  width: 100%;
}

            `
        }
    </style>
    <div className="profile-container">
      <div className="profile-card" data-aos="fade-up">
        <div className="profile-header">
          <img src="https://i.pravatar.cc/100" alt="Avatar" className="profile-avatar" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="role-badge">{user.role?.join(', ')}</span>
        </div>

        <div className="profile-body">
          <h4>Account Details</h4>
          <div className="detail-row">
            <span>Name:</span>
            <span>{user.name}</span>
          </div>
          <div className="detail-row">
            <span>Email:</span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
