// src/services/authService.js
const API_URL = 'http://localhost:5000/api';

// Save token to local storage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token from local storage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Save user info to local storage
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user info from local storage
const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Remove user info from local storage
const removeUser = () => {
  localStorage.removeItem('user');
};

// Register a new user
const register = async (username, email, password, isRecruiter = true) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        is_recruiter: isRecruiter,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Login user
const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    return data;
  } catch (error) {
    throw error;
  }
};

// Logout user
const logout = () => {
  removeToken();
  removeUser();
};

// Check if user is logged in
const isAuthenticated = () => {
  return !!getToken();
};

// Check if user is a recruiter
const isRecruiter = () => {
  const user = getUser();
  return user && user.is_recruiter;
};

// Create auth header
const authHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  isRecruiter,
  getToken,
  getUser,
  authHeader,
};

export default authService;