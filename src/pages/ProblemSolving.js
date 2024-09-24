import React, { useState, useEffect } from 'react';
import { createProblem, getProblems, addSolution, getSolutions } from '../services/api';
import { useAuth } from '../AuthContext';
import Error from '../components/Error';
import styles from '../App.module.css';

function ProblemSolving() {
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({ title: '', description: '' });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewSolution] = useState('');
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const data = await getProblems();
      setProblems(data);
    } catch (error) {
      setError('Failed to fetch problems. Please try again later.');
    }
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    try {
      await createProblem(newProblem);
      setNewProblem({ title: '', description: '' });
      fetchProblems();
    } catch (error) {
      setError('Failed to create problem. Please try again.');
    }
  };

  const handleSelectProblem = async (problem) => {
    setSelectedProblem(problem);
    try {
      const solutionsData = await getSolutions(problem.id);
      setSolutions(solutionsData);
    } catch (error) {
      setError('Failed to fetch solutions. Please try again.');
    }
  };

  const handleAddSolution = async (e) => {
    e.preventDefault();
    try {
      await addSolution(selectedProblem.id, { content: newSolution });
      setNewSolution('');
      const updatedSolutions = await getSolutions(selectedProblem.id);
      setSolutions(updatedSolutions);
    } catch (error) {
      setError('Failed to add solution. Please try again.');
    }
  };

  return (
    <div>
      <h2>Collaborative Problem Solving</h2>
      {error && <Error message={error} />}
      {user && (
        <div className={styles.card}>
          <h3>Submit a New Problem</h3>
          <form onSubmit={handleCreateProblem} className={styles.form}>
            <input
              type="text"
              placeholder="Problem Title"
              value={newProblem.title}
              onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Problem Description"
              value={newProblem.description}
              onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
              required
            />
            <button type="submit" className={styles.button}>Submit Problem</button>
          </form>
        </div>
      )}
      <h3>Current Problems</h3>
      {problems.map(problem => (
        <div key={problem.id} onClick={() => handleSelectProblem(problem)} className={styles.card}>
          <h4>{problem.title}</h4>
          <p>{problem.description}</p>
          <p>Posted by: {problem.username}</p>
        </div>
      ))}
      {selectedProblem && (
        <div className={styles.card}>
          <h3>Solutions for: {selectedProblem.title}</h3>
          {solutions.map(solution => (
            <div key={solution.id} className={styles.card}>
              <p>{solution.content}</p>
              <p>Proposed by: {solution.username}</p>
            </div>
          ))}
          {user && (
            <form onSubmit={handleAddSolution} className={styles.form}>
              <textarea
                placeholder="Your solution"
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                required
              />
              <button type="submit" className={styles.button}>Submit Solution</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default ProblemSolving;