import React, { useState } from 'react';

function SupportButton({ postId }) {
  const [supported, setSupported] = useState(false);

  const handleSupport = () => {
    // Implement support logic here
    setSupported(!supported);
    console.log(`Post ${postId} ${supported ? 'unsupported' : 'supported'}`);
  };

  return (
    <button onClick={handleSupport}>
      {supported ? 'Unsupport' : 'Support'} this post
    </button>
  );
}

export default SupportButton;