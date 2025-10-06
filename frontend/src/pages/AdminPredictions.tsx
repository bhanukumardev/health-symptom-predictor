import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Prediction {
  id: number;
  user_email: string;
  symptoms: string;
  predicted_disease: string;
  confidence_score: number;
  created_at: string;
  has_feedback: boolean;
  is_accurate: boolean | null;
  rating: number | null;
}

export default function AdminPredictions() {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPredictions(token);
  }, [navigate]);

  const fetchPredictions = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/predictions', {
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
        throw new Error('Failed to load predictions');
      }

      const data = await response.json();
      setPredictions(data);
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
          <h1 className="text-2xl font-semibold">All Predictions</h1>
          <Link to="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
        </div>
        <div className="card h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Predictions ({predictions.length})</h1>
        <Link to="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
      </div>

      <div className="space-y-3">
        {predictions.map((pred) => (
          <div key={pred.id} className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-cyan-400">{pred.predicted_disease}</h3>
                  <span className="text-xs text-slate-500">by {pred.user_email}</span>
                </div>
                
                <div className="text-sm text-slate-400">
                  <span className="font-medium">Symptoms:</span> {pred.symptoms}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                          style={{ width: `${pred.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{Math.round(pred.confidence_score * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    {new Date(pred.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                {pred.has_feedback ? (
                  <div className="space-y-1">
                    <div>
                      {pred.is_accurate ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                          ✓ Accurate
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                          ✗ Inaccurate
                        </span>
                      )}
                    </div>
                    {pred.rating && (
                      <div className="text-xs text-yellow-400">
                        {'⭐'.repeat(pred.rating)}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-400">
                    No feedback
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {predictions.length === 0 && (
          <div className="card p-8 text-center text-slate-400">
            No predictions found
          </div>
        )}
      </div>
    </div>
  );
}
