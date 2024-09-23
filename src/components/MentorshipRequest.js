import React, { useState } from 'react';

function MentorshipRequest() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Mentorship request submitted', { topic, description });
    // Reset form
    setTopic('');
    setDescription('');
  };

  return (
    <div>
      <h3>Request Mentorship</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <textarea
          placeholder="Describe what you'd like help with"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default MentorshipRequest;