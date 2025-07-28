// frontend/src/UserManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

interface User {
  id: number;
  username: string;
  createdAt: string;
}

export const UserManager = ({ token }: { token: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL, authHeaders);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post(API_URL, { username: newUsername, password: newPassword }, authHeaders);
      setMessage(`User "${newUsername}" created successfully!`);
      setNewUsername('');
      setNewPassword('');
      fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setError('');
      setMessage('');
      try {
        await axios.delete(`${API_URL}/${userId}`, authHeaders);
        setMessage('User deleted successfully!');
        fetchUsers(); // Refresh list
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="user-manager">
      <h3>Create New User</h3>
      <form onSubmit={handleCreateUser} className="user-form">
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Create User</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <h3>Existing Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.id === 1} // Disable delete for admin
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
