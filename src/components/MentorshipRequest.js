import React, { useState } from 'react';
import { createMentorshipRequest } from '../services/api';

function MentorshipRequest() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMentorshipRequest({ title, description });
      setTitle('');
      setDescription('');
      alert('Mentorship request created successfully!');
    } catch (error) {
      console.error('Failed to create mentorship request:', error);
      alert('Failed to create mentorship request. Please try again.');
    }
  };

  return (
    <div>
      <h3>Request Mentorship</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe what you'd like help with"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default MentorshipRequest;