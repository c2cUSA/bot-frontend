// frontend/src/WalletManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const WalletManager = ({ token }: { token: string }) => {
    const [wallets, setWallets] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchWallets = async () => {
        const response = await axios.get(`${API_URL}/wallets`, authHeaders);
        setWallets(response.data);
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const addPhantom = async () => {
        setMessage('Connecting Phantom... Please check wallet prompts.');
        try {
            await axios.post(`${API_URL}/wallets/add-phantom`, {}, authHeaders);
            setMessage('Phantom connected successfully!');
            fetchWallets();
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to connect Phantom.');
        }
    };

    return (
        <div className="status-card">
            <h2>Wallet Manager</h2>
            <div className="controls">
                <button onClick={addPhantom}>Add Phantom</button>
                <button onClick={() => alert('Ledger connection needs to be handled via hardware.')}>Add Ledger</button>
                <button onClick={fetchWallets}>Refresh Wallets</button>
            </div>
            {message && <p>{message}</p>}
            <ul>
                {wallets.map(wallet => (
                    <li key={wallet.publicKey}>{wallet.type}: {wallet.publicKey}</li>
                ))}
            </ul>
        </div>
    );
};
