// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import MentorshipRequest from './MentorshipRequest';
import styles from '../App.module.css';

function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.sidebar}>
      <h3>Mentorship</h3>
      <MentorshipRequest />
      <Link to="/problem-solving">Problem Solving</Link>
    </div>
  );
}

export default Sidebar;