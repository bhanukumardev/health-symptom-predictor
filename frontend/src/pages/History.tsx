import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS, fetchWithAuth } from '../lib/api-config';

interface Prediction {
  id: number;
  predicted_disease: string;
  confidence_score: number;
  symptoms: string[];
  timestamp: string;
  medicine_recommendations?: string;  // ✨ Top-level field from API
  additional_analysis?: {             // ✨ Top-level field from API
    summary?: string;
    additional_symptoms?: string[];
    language_detected?: string;
  };
  additional_info?: {                 // ✨ Still available for legacy data
    medicine_advice?: string;
    ai_analysis?: any;
    additional_details?: string;
  };
}

export default function History() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PREDICTIONS.HISTORY);
      
      if (!response.ok) {
        throw new Error('Failed to load history');
      }
      
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          {i18n.language === 'hi' ? '📜 भविष्यवाणी इतिहास' : '📜 Prediction History'}
        </h1>
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          {i18n.language === 'hi' ? '📜 भविष्यवाणी इतिहास' : '📜 Prediction History'}
        </h1>
        <p className="text-slate-400">
          {i18n.language === 'hi' 
            ? `आपकी अंतिम ${predictions.length} भविष्यवाणियाँ (अधिकतम 10 सहेजी जाती हैं)` 
            : `Your last ${predictions.length} predictions (Maximum 10 saved)`}
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg text-sm">
        <p className="text-blue-300">
          {i18n.language === 'hi' 
            ? 'ℹ️ स्थान बचाने के लिए केवल आपकी अंतिम 10 भविष्यवाणियाँ सहेजी जाती हैं। पुरानी भविष्यवाणियाँ स्वचालित रूप से हटा दी जाती हैं।' 
            : 'ℹ️ Only your last 10 predictions are saved to conserve space. Older predictions are automatically removed.'}
        </p>
      </div>

      {predictions.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-400 text-lg mb-4">
            {i18n.language === 'hi' ? 'अभी तक कोई इतिहास नहीं' : 'No history yet'}
          </p>
          <p className="text-slate-500 mb-6">
            {i18n.language === 'hi' 
              ? 'इसे यहां देखने के लिए एक भविष्यवाणी करें' 
              : 'Run a prediction to see it here'}
          </p>
          <button 
            onClick={() => navigate('/predict')} 
            className="btn btn-primary"
          >
            {i18n.language === 'hi' ? '🔮 भविष्यवाणी शुरू करें' : '🔮 Start Prediction'}
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {predictions.map((pred, index) => {
            const isExpanded = expandedId === pred.id;
            const isRecent = index < 3; // Highlight recent predictions
            
            return (
              <div 
                key={pred.id} 
                className={`card p-5 transition-all ${isRecent ? 'border-purple-500/30' : ''}`}
              >
                {/* Compact View */}
                <div 
                  className="cursor-pointer"
                  onClick={() => toggleExpand(pred.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isRecent && <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                          {i18n.language === 'hi' ? 'हाल का' : 'Recent'}
                        </span>}
                        <h3 className="text-lg font-medium">
                          {t(`diseases.${pred.predicted_disease}`, pred.predicted_disease)}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        {new Date(pred.timestamp).toLocaleString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Confidence Badge */}
                      <div className="text-right">
                        <div className="text-xs text-slate-400 mb-1">
                          {i18n.language === 'hi' ? 'विश्वास' : 'Confidence'}
                        </div>
                        <div className="text-sm font-semibold text-cyan-400">
                          {Math.round(pred.confidence_score * 100)}%
                        </div>
                      </div>
                      
                      {/* Expand Button */}
                      <button className="text-2xl hover:text-cyan-400 transition-colors">
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </div>
                  </div>

                  {/* Symptoms Preview */}
                  <div className="flex flex-wrap gap-2">
                    {pred.symptoms.slice(0, 3).map((symptom, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-300">
                        {t(`symptoms.${symptom}`, symptom)}
                      </span>
                    ))}
                    {pred.symptoms.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-400">
                        +{pred.symptoms.length - 3} {i18n.language === 'hi' ? 'और' : 'more'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-4 animate-in fade-in duration-200">
                    {/* All Symptoms */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-slate-300">
                        {i18n.language === 'hi' ? '🔴 लक्षण:' : '🔴 Symptoms:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {pred.symptoms.map((symptom, i) => (
                          <span key={i} className="text-sm px-3 py-1 bg-slate-800 rounded-full text-slate-200">
                            {t(`symptoms.${symptom}`, symptom)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-slate-300">
                        {i18n.language === 'hi' ? '📊 विश्वास स्तर:' : '📊 Confidence Level:'}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all"
                            style={{ width: `${pred.confidence_score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(pred.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Medicine Recommendations */}
                    {pred.medicine_recommendations && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-cyan-300">
                          {i18n.language === 'hi' ? '💊 दवा की सलाह:' : '💊 Medicine Advice:'}
                        </h4>
                        <div className="p-3 bg-cyan-900/20 border border-cyan-700/30 rounded text-sm text-slate-200 whitespace-pre-wrap">
                          {pred.medicine_recommendations}
                        </div>
                      </div>
                    )}

                    {/* AI Analysis */}
                    {pred.additional_analysis && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-purple-300">
                          {i18n.language === 'hi' ? '🔍 AI विश्लेषण:' : '🔍 AI Analysis:'}
                        </h4>
                        <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded text-sm">
                          {pred.additional_analysis.summary && (
                            <p className="text-slate-200 mb-2">{pred.additional_analysis.summary}</p>
                          )}
                          {pred.additional_analysis.additional_symptoms?.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-purple-300">
                                {i18n.language === 'hi' ? 'अतिरिक्त लक्षण:' : 'Additional symptoms:'}
                              </span>
                              <span className="text-slate-300 ml-2">
                                {pred.additional_analysis.additional_symptoms.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    {pred.additional_info?.additional_details && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-slate-300">
                          {i18n.language === 'hi' ? '📝 अतिरिक्त विवरण:' : '📝 Additional Details:'}
                        </h4>
                        <div className="p-3 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300">
                          {pred.additional_info.additional_details}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(pred.id);
                        }}
                        className="btn btn-secondary text-sm"
                      >
                        {i18n.language === 'hi' ? '✖ बंद करें' : '✖ Close'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
