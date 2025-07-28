// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { LoginPage } from './LoginPage';
import { TradingDashboard } from './TradingDashboard';
import { WalletManager } from './WalletManager';
import { UserManager } from './UserManager'; // Import the new component

const API_URL = 'http://localhost:8080/api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [status, setStatus] = useState<any>({});
  const [view, setView] = useState<'dashboard' | 'wallets' | 'users'>('dashboard'); // Add 'users' to view state

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      const fetchStatus = async () => {
        try {
          const response = await axios.get(`${API_URL}/status`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStatus(response.data);
        } catch (error) {
          console.error("Session expired or invalid.", error);
          handleLogout();
        }
      };
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="App">
        <header className="App-header">
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ENT-WT v2.0 Control Panel</h1>
        <nav>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('wallets')}>Wallets</button>
          <button onClick={() => setView('users')}>Users</button> {/* Add Users button */}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
        {view === 'dashboard' && token && <TradingDashboard status={status} token={token} />}
        {view === 'wallets' && token && <WalletManager token={token} />}
        {view === 'users' && token && <UserManager token={token} />} {/* Render UserManager */}
      </header>
    </div>
  );
}

export default App;