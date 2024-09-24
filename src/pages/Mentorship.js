import React, { useState, useEffect } from 'react';
import MentorshipRequest from '../components/MentorshipRequest';
import { getMentorshipRequests, acceptMentorshipRequest } from '../services/api';
import { useAuth } from '../AuthContext';

function Mentorship() {
  const [requests, setRequests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMentorshipRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch mentorship requests:', error);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await acceptMentorshipRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
      alert('Mentorship request accepted!');
    } catch (error) {
      console.error('Failed to accept mentorship request:', error);
      alert('Failed to accept mentorship request. Please try again.');
    }
  };

  return (
    <div>
      <h2>Mentorship Program</h2>
      <MentorshipRequest />
      <h3>Open Mentorship Requests</h3>
      {requests.map(request => (
        <div key={request.id}>
          <h4>{request.title}</h4>
          <p>{request.description}</p>
          <p>Requested by: {request.mentee_username}</p>
          {user && user.id !== request.mentee_id && (
            <button onClick={() => handleAccept(request.id)}>Offer to Mentor</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Mentorship;