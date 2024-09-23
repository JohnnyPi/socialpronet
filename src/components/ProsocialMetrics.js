import React from 'react';

function ProsocialMetrics({ userId }) {
  // In a real app, you'd fetch these metrics from your backend
  const metrics = {
    helpfulnessScore: 85,
    supportGiven: 42,
    problemsSolved: 7,
    gratitudeReceived: 23
  };

  return (
    <div>
      <h3>Prosocial Metrics</h3>
      <ul>
        <li>Helpfulness Score: {metrics.helpfulnessScore}</li>
        <li>Support Given: {metrics.supportGiven}</li>
        <li>Problems Solved: {metrics.problemsSolved}</li>
        <li>Gratitude Received: {metrics.gratitudeReceived}</li>
      </ul>
    </div>
  );
}

export default ProsocialMetrics;