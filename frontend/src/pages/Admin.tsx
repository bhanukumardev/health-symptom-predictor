import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Stats {
  total_users: number;
  total_predictions: number;
  total_feedback: number;
  average_confidence: number;
  accuracy_rate: number;
  top_diseases: { disease: string; count: number }[];
}

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert('Admin access required');
          navigate('/');
          return;
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-slate-400">Failed to load statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-4">
          <div className="text-sm text-slate-400">Total Users</div>
          <div className="text-3xl font-bold text-cyan-400">{stats.total_users}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-400">Total Predictions</div>
          <div className="text-3xl font-bold text-cyan-400">{stats.total_predictions}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-400">Total Feedback</div>
          <div className="text-3xl font-bold text-cyan-400">{stats.total_feedback}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-400">Accuracy Rate</div>
          <div className="text-3xl font-bold text-green-400">{stats.accuracy_rate}%</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-slate-400 mb-1">Average Confidence Score</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                  style={{ width: `${stats.average_confidence * 100}%` }}
                />
              </div>
              <span className="text-lg font-medium">{Math.round(stats.average_confidence * 100)}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">User Satisfaction (Accuracy Rate)</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                  style={{ width: `${stats.accuracy_rate}%` }}
                />
              </div>
              <span className="text-lg font-medium">{stats.accuracy_rate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Predicted Diseases */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Top Predicted Diseases</h2>
        <div className="space-y-3">
          {stats.top_diseases.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm w-6">{index + 1}.</span>
                <span className="font-medium">{item.disease}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500"
                    style={{ width: `${(item.count / stats.top_diseases[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm w-12 text-right">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <a 
            href="/admin/users"
            className="btn btn-ghost text-left p-4 hover:bg-slate-800"
          >
            <div className="text-sm text-slate-400">Manage</div>
            <div className="font-medium">All Users</div>
          </a>
          <a 
            href="/admin/predictions"
            className="btn btn-ghost text-left p-4 hover:bg-slate-800"
          >
            <div className="text-sm text-slate-400">View</div>
            <div className="font-medium">All Predictions</div>
          </a>
          <a 
            href="/admin/feedback"
            className="btn btn-ghost text-left p-4 hover:bg-slate-800"
          >
            <div className="text-sm text-slate-400">Review</div>
            <div className="font-medium">All Feedback</div>
          </a>
        </div>
      </div>
    </div>
  );
}
