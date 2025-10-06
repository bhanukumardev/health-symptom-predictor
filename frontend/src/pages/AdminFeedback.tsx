import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Feedback {
  id: number;
  prediction_id: number;
  user_email: string;
  predicted_disease: string;
  is_accurate: boolean;
  rating: number | null;
  actual_diagnosis: string | null;
  comments: string | null;
  created_at: string;
}

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFeedback(token);
  }, [navigate]);

  const fetchFeedback = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/feedback', {
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
        throw new Error('Failed to load feedback');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Feedback</h1>
          <Link to="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
        </div>
        <div className="card h-64 animate-pulse" />
      </div>
    );
  }

  const accurateCount = feedback.filter(f => f.is_accurate).length;
  const inaccurateCount = feedback.filter(f => !f.is_accurate).length;
  const avgRating = feedback.filter(f => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.filter(f => f.rating).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Feedback ({feedback.length})</h1>
        <Link to="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-slate-400">Accurate Predictions</div>
          <div className="text-2xl font-bold text-green-400">{accurateCount}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-400">Inaccurate Predictions</div>
          <div className="text-2xl font-bold text-red-400">{inaccurateCount}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-400">Average Rating</div>
          <div className="text-2xl font-bold text-yellow-400">
            {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'} ⭐
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {feedback.map((fb) => (
          <div key={fb.id} className="card p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-cyan-400">{fb.predicted_disease}</h3>
                    {fb.is_accurate ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                        ✓ Accurate
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                        ✗ Inaccurate
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {fb.user_email} • {new Date(fb.created_at).toLocaleString()}
                  </div>
                </div>
                
                {fb.rating && (
                  <div className="text-yellow-400">
                    {'⭐'.repeat(fb.rating)}
                  </div>
                )}
              </div>
              
              {fb.actual_diagnosis && (
                <div className="bg-slate-800/50 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Actual Diagnosis:</div>
                  <div className="text-sm font-medium">{fb.actual_diagnosis}</div>
                </div>
              )}
              
              {fb.comments && (
                <div className="bg-slate-800/50 rounded p-3">
                  <div className="text-xs text-slate-400 mb-1">Comments:</div>
                  <div className="text-sm">{fb.comments}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {feedback.length === 0 && (
          <div className="card p-8 text-center text-slate-400">
            No feedback found
          </div>
        )}
      </div>
    </div>
  );
}
