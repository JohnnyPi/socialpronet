import React, { useState, useEffect } from 'react';
import ProsocialMetrics from '../components/ProsocialMetrics';
import { fetchUser } from '../services/api';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Assuming user ID 1 for now. In a real app, you'd get this from authentication.
        const userData = await fetchUser(1);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    loadUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.username}'s Profile</h2>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <h3>Skills:</h3>
      <ul>
        {user.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <p>Helpfulness Score: {user.helpfulnessScore}</p>
      <ProsocialMetrics userId={user.id} />
    </div>
  );
}

export default Profile;