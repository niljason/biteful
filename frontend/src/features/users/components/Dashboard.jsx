import { useEffect, useState } from 'react';
import { userService } from '../services/userService';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Call the UserRest /user/profile endpoint
    userService.getProfile()
      .then(data => setUser(data))
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome back!</h1>
      {user ? (
        <div className="profile-info">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;