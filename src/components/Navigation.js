import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from '../App.module.css';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/mentorship">Mentorship</Link></li>
        <li><Link to="/problem-solving">Problem Solving</Link></li>
        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/create-post">Create Post</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;