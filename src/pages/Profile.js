import React from 'react';
import { useAuth } from '../AuthContext';
import ProsocialMetrics from '../components/ProsocialMetrics';

function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div>
      <h2>{user.username}'s Profile</h2>
      <p>Email: {user.email}</p>
      <ProsocialMetrics userId={user.id} />
    </div>
  );
}

export default Profile;