// frontend/src/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password, token });
            onLoginSuccess(response.data.accessToken);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed!');
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="2FA Token" required />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};