import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS, fetchWithAuth } from '../lib/api-config';

const SYMPTOMS = [
  'Fever', 'Cough', 'Fatigue', 'Headache', 'Nausea', 'Vomiting',
  'Diarrhea', 'Abdominal Pain', 'Chest Pain', 'Shortness of Breath',
  'Sore Throat', 'Runny Nose', 'Body Aches', 'Loss of Appetite',
  'Dizziness', 'Chills', 'Sweating', 'Rash', 'Joint Pain'
];

export default function Predict() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [isAccurate, setIsAccurate] = useState<boolean | null>(null);
  const [actualDiagnosis, setActualDiagnosis] = useState('');
  const [comments, setComments] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleSymptom = (s: string) => {
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) return;
    setLoading(true);
    try {
      // Send prediction request with language parameter
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.PREDICTIONS.PREDICT}?language=${i18n.language}`,
        {
          method: 'POST',
          body: JSON.stringify({ 
            symptoms: selected,
            additional_details: notes  // Send the additional details
          })
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Prediction failed: ${response.status}`);
      }
      const data = await response.json();
      
      // Store the original result without translation
      // Translation will happen in the display component using t() function
      setResult(data);
      
      setFeedbackSubmitted(false);
      setRating(0);
      setIsAccurate(null);
      setActualDiagnosis('');
      setComments('');
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        alert('Cannot connect to server. Please ensure the backend is running on http://localhost:8888');
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAccurate === null) return;
    
    setFeedbackLoading(true);
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PREDICTIONS.FEEDBACK, {
        method: 'POST',
        body: JSON.stringify({
          prediction_id: result.id,
          is_accurate: isAccurate,
          rating: rating || undefined,
          actual_diagnosis: actualDiagnosis || undefined,
          comments: comments || undefined
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to submit feedback');
      }
      
      setFeedbackSubmitted(true);
      alert('Thank you for your feedback!');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Symptom Selection Card */}
      <div className="card p-4 md:p-6">
        <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">{t('predict.title')}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label mb-2 text-sm md:text-base">{t('predict.selectSymptoms')}</label>
            
            {/* Mobile-optimized symptom chips */}
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => {
                const isSelected = selected.includes(s);
                const chipClass = isSelected 
                  ? 'bg-cyan-500 text-slate-900 font-medium border-2 border-cyan-400' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-slate-700';
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`rounded-full px-4 py-2.5 md:px-3 md:py-1.5 text-sm md:text-sm font-medium transition-all ${chipClass} min-w-[80px] touch-manipulation`}
                  >
                    {isSelected && '✓ '}{t(`symptoms.${s}`)}
                  </button>
                );
              })}
            </div>
            
            {/* Selected symptoms counter for mobile */}
            {selected.length > 0 && (
              <div className="mt-3 p-2 bg-cyan-900/20 border border-cyan-700/30 rounded-lg">
                <p className="text-xs md:text-sm text-cyan-300">
                  ✓ {selected.length} symptom{selected.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
          
          {/* Additional Details Textarea */}
          <div className="grid gap-2">
            <label htmlFor="notes" className="label text-sm md:text-base">
              {t('predict.additionalDetails')}
            </label>
            <textarea 
              id="notes" 
              className="input min-h-[100px] md:min-h-[80px] text-sm md:text-base p-3" 
              placeholder={t('predict.additionalDetailsPlaceholder')} 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>
          
          {/* Submit Button - Full width on mobile */}
          <button 
            className="btn btn-primary w-full md:w-auto text-base py-3 md:py-2 font-semibold" 
            type="submit" 
            disabled={selected.length === 0 || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {t('predict.analyzing')}
              </span>
            ) : (
              t('predict.submit')
            )}
          </button>
          
          {selected.length === 0 && (
            <p className="text-xs md:text-sm text-slate-400">
              {t('predict.selectAtLeastOne')}
            </p>
          )}
        </form>
      </div>
      {/* Results Card */}
      {result && (
        <div className="card p-4 md:p-6">
          <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold">
            {t('predict.predictionResults')}
          </h2>
          <div className="space-y-4">
            {/* Disease Name and Confidence */}
            <div>
              <h3 className="text-lg md:text-xl font-medium mb-3">
                {String(t(`diseases.${result.predicted_disease}`, result.predicted_disease))}
              </h3>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs md:text-sm mb-1">
                  <span className="font-medium">{t('predict.confidence')}</span>
                  <span className="font-bold text-cyan-400 text-base md:text-lg">
                    {Math.round(result.confidence_score * 100)}%
                  </span>
                </div>
                <div className="h-3 md:h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all" 
                    style={{ width: `${result.confidence_score * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Groq AI Medicine Recommendations */}
            {result.medicine_recommendations && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl md:text-3xl">💊</span>
                  <h4 className="font-semibold text-base md:text-lg text-cyan-300">
                    {i18n.language === 'hi' ? 'दवाइयां और सलाह (AI द्वारा)' : 'Medicines & Advice (AI-Powered)'}
                  </h4>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {result.medicine_recommendations}
                  </div>
                </div>
                {result.ai_disclaimer && (
                  <div className="mt-3 pt-3 border-t border-cyan-700/30 text-xs text-cyan-400/80 italic">
                    {result.ai_disclaimer}
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis of Additional Details */}
            {result.additional_analysis && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl md:text-3xl">🔍</span>
                  <h4 className="font-semibold text-base md:text-lg text-purple-300">
                    {i18n.language === 'hi' ? 'आपके अतिरिक्त विवरण का विश्लेषण' : 'AI Analysis of Your Details'}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {/* Summary */}
                  {result.additional_analysis.summary && (
                    <div className="text-slate-200 bg-black/20 p-3 rounded">
                      <p className="text-sm leading-relaxed">{result.additional_analysis.summary}</p>
                    </div>
                  )}
                  
                  {/* Additional Symptoms Found */}
                  {result.additional_analysis.additional_symptoms && result.additional_analysis.additional_symptoms.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-purple-200 mb-2">
                        {i18n.language === 'hi' ? '🔴 अतिरिक्त लक्षण मिले:' : '🔴 Additional Symptoms Found:'}
                      </h5>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {result.additional_analysis.additional_symptoms.map((symptom: string, i: number) => (
                          <li key={i}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Severity */}
                  {result.additional_analysis.severity && result.additional_analysis.severity !== 'None' && (
                    <div>
                      <h5 className="text-sm font-semibold text-purple-200 mb-1">
                        {i18n.language === 'hi' ? '📊 गंभीरता:' : '📊 Severity:'}
                      </h5>
                      <p className="text-sm text-slate-300">{result.additional_analysis.severity}</p>
                    </div>
                  )}
                  
                  {/* Context */}
                  {result.additional_analysis.context && result.additional_analysis.context !== 'None' && (
                    <div>
                      <h5 className="text-sm font-semibold text-purple-200 mb-1">
                        {i18n.language === 'hi' ? '📝 महत्वपूर्ण जानकारी:' : '📝 Important Context:'}
                      </h5>
                      <p className="text-sm text-slate-300">{result.additional_analysis.context}</p>
                    </div>
                  )}
                  
                  {/* Red Flags */}
                  {result.additional_analysis.red_flags && result.additional_analysis.red_flags !== 'None' && Array.isArray(result.additional_analysis.red_flags) && result.additional_analysis.red_flags.length > 0 && (
                    <div className="bg-red-900/30 border border-red-700/50 p-3 rounded">
                      <h5 className="text-sm font-semibold text-red-200 mb-2 flex items-center gap-2">
                        <span>⚠️</span>
                        {i18n.language === 'hi' ? 'चेतावनी - तुरंत डॉक्टर से मिलें:' : 'Warning - Seek Medical Attention:'}
                      </h5>
                      <ul className="list-disc list-inside text-sm text-red-100 space-y-1">
                        {result.additional_analysis.red_flags.map((flag: string, i: number) => (
                          <li key={i} className="font-medium">{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Language Detected */}
                  {result.additional_analysis.language_detected && (
                    <div className="text-xs text-purple-400/70 italic pt-2 border-t border-purple-700/30">
                      {i18n.language === 'hi' ? '🌐 पहचानी गई भाषा: ' : '🌐 Language detected: '}
                      {result.additional_analysis.language_detected}
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <h4 className="font-medium mb-2 text-sm md:text-base flex items-center gap-2">
                  <span>💡</span> {t('predict.recommendations')}
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-slate-300 leading-relaxed">
                  {result.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {result.precautions && result.precautions.length > 0 && (
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <h4 className="font-medium mb-2 text-sm md:text-base flex items-center gap-2">
                  <span>⚠️</span> {t('predict.precautions')}
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-slate-300 leading-relaxed">
                  {result.precautions.map((p: string, i: number) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Feedback Form */}
      {result && !feedbackSubmitted && (
        <div className="card p-4 md:p-6">
          <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-semibold">
            {t('predict.feedback.title')}
          </h2>
          <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
            <div>
              <label className="label mb-2 text-sm md:text-base">
                {t('predict.feedback.wasAccurate')}
              </label>
              <div className="flex gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAccurate(true)}
                  className={`flex-1 md:flex-initial px-4 md:px-6 py-3 md:py-2 rounded-lg font-medium transition text-sm md:text-base ${
                    isAccurate === true 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ✓ {t('predict.feedback.yesAccurate')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAccurate(false)}
                  className={`flex-1 md:flex-initial px-4 md:px-6 py-3 md:py-2 rounded-lg font-medium transition text-sm md:text-base ${
                    isAccurate === false 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ✗ {t('predict.feedback.noInaccurate')}
                </button>
              </div>
            </div>

            <div>
              <label className="label mb-2 text-sm md:text-base">
                {t('predict.feedback.rateOptional')}
              </label>
              <div className="flex gap-2 md:gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl md:text-2xl transition touch-manipulation ${
                      star <= rating ? 'text-yellow-500' : 'text-slate-600 hover:text-yellow-500'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {isAccurate === false && (
              <div className="grid gap-2">
                <label htmlFor="actualDiagnosis" className="label text-sm md:text-base">
                  {t('predict.feedback.actualDiagnosis')}
                </label>
                <input
                  id="actualDiagnosis"
                  type="text"
                  className="input text-sm md:text-base p-3"
                  placeholder={t('predict.feedback.actualDiagnosisPlaceholder')}
                  value={actualDiagnosis}
                  onChange={(e) => setActualDiagnosis(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="comments" className="label text-sm md:text-base">
                {t('predict.feedback.comments')}
              </label>
              <textarea
                id="comments"
                className="input min-h-[100px] md:min-h-[80px] text-sm md:text-base p-3"
                placeholder={t('predict.feedback.commentsPlaceholder')}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-full md:w-auto text-base py-3 md:py-2 font-semibold"
              type="submit"
              disabled={isAccurate === null || feedbackLoading}
            >
              {feedbackLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {t('predict.feedback.submitting')}
                </span>
              ) : (
                t('predict.feedback.submitFeedback')
              )}
            </button>
          </form>
        </div>
      )}

      {/* Feedback Success Message */}
      {feedbackSubmitted && (
        <div className="card p-4 md:p-6 bg-green-900/20 border-green-700">
          <p className="text-green-400 text-center text-sm md:text-base font-medium">
            ✓ {t('predict.feedback.thankYou')}
          </p>
        </div>
      )}
    </div>
  );
}