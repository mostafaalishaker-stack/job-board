import React, { useState, useEffect } from 'react';
import Login from './pages/Login.js';
import JobBoard from './pages/JobBoard.js';
import { api } from './api/client.js';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', color: '#e2e8f0' }}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <JobBoard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
