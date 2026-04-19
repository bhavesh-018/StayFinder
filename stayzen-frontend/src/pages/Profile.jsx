const Profile = () => {
  const user =
    JSON.parse(localStorage.getItem('user')) || {};

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <>
      <style>{`
  .profile-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px 20px 40px;
    background-image:
      linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
      url('/images/hero_4.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .profile-card {
    width: 100%;
    max-width: 520px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(14px);
    border-radius: 24px;
    padding: 36px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
  }

  .profile-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .profile-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    margin: 0 auto 16px;
    border: 1px solid rgba(255,255,255,0.3);
  }

  .profile-name {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 6px;
    color: white;
  }

  .profile-email {
    color: rgba(255,255,255,0.8);
    margin-bottom: 12px;
  }

  .role-badge {
    display: inline-block;
    background: #f59e0b;
    color: white;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 18px;
    color: white;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    color: white;
  }

  .detail-label {
    font-weight: 600;
  }

  .detail-value {
    color: rgba(255,255,255,0.8);
  }
`}</style>

      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {initials}
            </div>

            <div className="profile-name">
              {user.name}
            </div>

            <div className="profile-email">
              {user.email}
            </div>

            <span className="role-badge">
              {user.role?.join(', ')}
            </span>
          </div>

          <div>
            <div className="section-title">
              Account Details
            </div>

            <div className="detail-row">
              <span className="detail-label">
                Name
              </span>
              <span className="detail-value">
                {user.name}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                Email
              </span>
              <span className="detail-value">
                {user.email}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                Role
              </span>
              <span className="detail-value">
                {user.role?.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;