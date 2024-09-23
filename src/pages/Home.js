import React, { useState, useEffect } from 'react';
import Comment from '../components/Comment';
import SupportButton from '../components/SupportButton';
import GratitudeButton from '../components/GratitudeButton';
import { fetchPosts } from '../services/api';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    loadPosts();
  }, []);

  return (
    <div>
      <h1>Welcome to Our Prosocial Network</h1>
      <p>Connect, support, and solve problems together.</p>
      <h2>Recent Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <SupportButton postId={post.id} />
          <GratitudeButton userId={post.userId} />
          <Comment postId={post.id} />
        </div>
      ))}
    </div>
  );
}

export default Home;