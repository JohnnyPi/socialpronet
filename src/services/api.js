const API_URL = '';

let accessToken = null;

const setAccessToken = (token) => {
  accessToken = token;
};

const getAccessToken = () => {
  return accessToken;
};

const authHeader = () => {
  return { Authorization: `Bearer ${accessToken}` };
};

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  setAccessToken(data.access_token);
  return data;
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const fetchUser = async () => {
  const response = await fetch(`${API_URL}/user`, {
    headers: authHeader(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};

export const createMentorshipRequest = async (data) => {
  const response = await fetch(`${API_URL}/mentorship/request`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create mentorship request');
  }
  return response.json();
};

export const getMentorshipRequests = async () => {
  const response = await fetch(`${API_URL}/mentorship/requests`, {
    headers: authHeader(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch mentorship requests');
  }
  return response.json();
};

export const acceptMentorshipRequest = async (requestId) => {
  const response = await fetch(`${API_URL}/mentorship/accept/${requestId}`, {
    method: 'POST',
    headers: authHeader(),
  });
  if (!response.ok) {
    throw new Error('Failed to accept mentorship request');
  }
  return response.json();
};

export const createProblem = async (data) => {
  const response = await fetch(`${API_URL}/problems`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create problem');
  }
  return response.json();
};

export const getProblems = async () => {
  const response = await fetch(`${API_URL}/problems`);
  if (!response.ok) {
    throw new Error('Failed to fetch problems');
  }
  return response.json();
};

export const addSolution = async (problemId, data) => {
  const response = await fetch(`${API_URL}/problems/${problemId}/solutions`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to add solution');
  }
  return response.json();
};

export const getSolutions = async (problemId) => {
  const response = await fetch(`${API_URL}/problems/${problemId}/solutions`);
  if (!response.ok) {
    throw new Error('Failed to fetch solutions');
  }
  return response.json();
};