import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  prediction_count: number;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers(token);
  }, [navigate]);

  const fetchUsers = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8888';
      const response = await fetch(`${apiUrl}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert('Admin access required');
          navigate('/admin');
          return;
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8888';
      const response = await fetch(`${apiUrl}/api/admin/users/${userId}/toggle-admin`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update user');
      }

      // Refresh the list
      fetchUsers(token);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const toggleActive = async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8888';
      const response = await fetch(`${apiUrl}/api/admin/users/${userId}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update user');
      }

      // Refresh the list
      fetchUsers(token);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Users</h1>
          <Link to="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
        </div>
        <div className="card h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Users ({users.length})</h1>
        <Link to="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-center">Predictions</th>
                <th className="px-4 py-3 text-center">Admin</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-center">Joined</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.full_name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400">
                      {user.prediction_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.is_admin ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-400">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.is_active ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleAdmin(user.id)}
                        className="btn btn-ghost text-xs py-1 px-2"
                        title="Toggle Admin"
                      >
                        👑
                      </button>
                      <button
                        onClick={() => toggleActive(user.id)}
                        className="btn btn-ghost text-xs py-1 px-2"
                        title="Toggle Active"
                      >
                        {user.is_active ? '🔒' : '🔓'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
