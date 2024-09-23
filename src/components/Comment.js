import React, { useState } from 'react';

function Comment({ postId }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement comment submission logic here
    console.log('New comment', { postId, comment });
    setComment('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default Comment;