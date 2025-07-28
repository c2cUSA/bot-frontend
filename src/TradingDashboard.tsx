// frontend/src/TradingDashboard.tsx
import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const TradingDashboard = ({ status, token }: { status: any, token: string }) => {
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const handleStart = () => {
        axios.post(`${API_URL}/start`, {}, authHeaders);
    };

    const handleStop = () => {
        axios.post(`${API_URL}/stop-bot`, {}, authHeaders);
    };

    return (
        <div className="status-card">
            <h2>Bot Dashboard</h2>
            <p>Status: <span className={status.isRunning ? 'status-active' : 'status-idle'}>{status.status}</span></p>
            <p>Trade Count: {status.tradeCount}</p>
            <div className="controls">
                <button onClick={handleStart} disabled={status.isRunning}>Start Bot</button>
                <button onClick={handleStop} disabled={!status.isRunning}>Stop Bot</button>
            </div>
        </div>
    );
};