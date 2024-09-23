import React, { useState } from 'react';
import { createPost } from '../services/api';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming user ID 1 for now. In a real app, you'd get this from authentication.
      const newPost = await createPost({ userId: 1, title, content });
      console.log('New post created:', newPost);
      // Clear form
      setTitle('');
      setContent('');
      // Optionally, redirect to home page or show a success message
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;