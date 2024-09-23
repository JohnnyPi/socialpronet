import React from 'react';
import MentorshipRequest from '../components/MentorshipRequest';

function Mentorship() {
  return (
    <div>
      <h2>Mentorship Program</h2>
      <p>Here you can request mentorship or offer to mentor others.</p>
      <MentorshipRequest />
      {/* You could add a list of open mentorship requests here */}
    </div>
  );
}

export default Mentorship;