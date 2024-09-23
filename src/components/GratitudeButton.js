import React, { useState } from 'react';

function GratitudeButton({ userId }) {
  const [expressed, setExpressed] = useState(false);

  const handleGratitude = () => {
    // Here you would typically send this data to your backend
    console.log(`Gratitude ${expressed ? 'unexpressed' : 'expressed'} to user ${userId}`);
    setExpressed(!expressed);
  };

  return (
    <button onClick={handleGratitude}>
      {expressed ? 'Undo' : 'Express'} Gratitude
    </button>
  );
}

export default GratitudeButton;