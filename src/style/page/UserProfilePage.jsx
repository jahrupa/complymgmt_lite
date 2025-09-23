import React from 'react';
import '../style/UserProfilePage.css';

const UserProfilePage = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header" />
        <div className="profile-image">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="User Avatar"
          />
        </div>
        <div className="profile-content">
          <h2>Jane Doe</h2>
          <p className="location">📍 San Francisco, CA</p>
          <p className="bio">
            Passionate developer. Coffee enthusiast. Travel junkie. Always learning something new.
          </p>
          <div className="stats">
            <div>
              <strong>850</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>320</strong>
              <span>Following</span>
            </div>
            <div>
              <strong>120</strong>
              <span>Posts</span>
            </div>
          </div>
          <button className="follow-button">Follow</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
