import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS, fetchWithAuth } from '../lib/api-config';

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  weight: number | null;
  is_admin: boolean;
  created_at: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    weight: ''
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.AUTH.PROFILE);
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }
      
      const data = await response.json();
      setProfile(data);
      
      // Initialize form data
      setFormData({
        full_name: data.full_name || '',
        age: data.age?.toString() || '',
        gender: data.gender || '',
        weight: data.weight?.toString() || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage(null);
      
      // Prepare update data
      const updateData = {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        weight: formData.weight ? parseFloat(formData.weight) : null
      };
      
      const response = await fetchWithAuth(API_ENDPOINTS.AUTH.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage({ 
        type: 'success', 
        text: i18n.language === 'hi' 
          ? '✅ प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!' 
          : '✅ Profile updated successfully!' 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: (error as Error).message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        weight: profile.weight?.toString() || ''
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-slate-400">
            {i18n.language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card p-6 text-center">
          <p className="text-red-400">
            {i18n.language === 'hi' ? 'प्रोफ़ाइल लोड नहीं हो सकी' : 'Failed to load profile'}
          </p>
          <button onClick={loadProfile} className="btn btn-primary mt-4">
            {i18n.language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {i18n.language === 'hi' ? '👤 मेरी प्रोफ़ाइल' : '👤 My Profile'}
        </h1>
        <p className="text-slate-400 mt-2">
          {i18n.language === 'hi' 
            ? 'अपनी व्यक्तिगत जानकारी देखें और अपडेट करें' 
            : 'View and update your personal information'}
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-900/20 border-green-700/50 text-green-300' 
            : 'bg-red-900/20 border-red-700/50 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="card p-6">
        {/* Edit/Cancel Button */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <span>✏️</span>
              {i18n.language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="btn bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
              disabled={saving}
            >
              <span>❌</span>
              {i18n.language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">
              {i18n.language === 'hi' ? '📧 खाता जानकारी' : '📧 Account Information'}
            </h2>
            
            <div className="space-y-4">
              {/* Email (Read-only) */}
              <div>
                <label className="label">
                  {i18n.language === 'hi' ? 'ईमेल' : 'Email'}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="input bg-slate-800/50 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {i18n.language === 'hi' 
                    ? '⚠️ सुरक्षा कारणों से ईमेल नहीं बदला जा सकता' 
                    : '⚠️ Email cannot be changed for security reasons'}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="label">
                  {i18n.language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  required
                  className={`input ${!isEditing ? 'bg-slate-800/50' : ''}`}
                  placeholder={i18n.language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                />
              </div>
            </div>
          </div>

          {/* Health Information Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              {i18n.language === 'hi' ? '🏥 स्वास्थ्य जानकारी' : '🏥 Health Information'}
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              {i18n.language === 'hi' 
                ? '💊 यह जानकारी व्यक्तिगत दवा खुराक के लिए उपयोग की जाती है' 
                : '💊 This information is used for personalized medicine dosage'}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Age */}
              <div>
                <label htmlFor="age" className="label">
                  {i18n.language === 'hi' ? 'उम्र (साल)' : 'Age (years)'}
                </label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  disabled={!isEditing}
                  className={`input ${!isEditing ? 'bg-slate-800/50' : ''}`}
                  placeholder={i18n.language === 'hi' ? 'उम्र' : 'Age'}
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="label">
                  {i18n.language === 'hi' ? 'लिंग' : 'Gender'}
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!isEditing}
                  className={`input ${!isEditing ? 'bg-slate-800/50' : ''}`}
                >
                  <option value="">{i18n.language === 'hi' ? 'चुनें' : 'Select'}</option>
                  <option value="M">{i18n.language === 'hi' ? 'पुरुष' : 'Male'}</option>
                  <option value="F">{i18n.language === 'hi' ? 'महिला' : 'Female'}</option>
                  <option value="O">{i18n.language === 'hi' ? 'अन्य' : 'Other'}</option>
                </select>
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="label">
                  {i18n.language === 'hi' ? 'वजन (किलो)' : 'Weight (kg)'}
                </label>
                <input
                  id="weight"
                  type="number"
                  min="1"
                  max="300"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  disabled={!isEditing}
                  className={`input ${!isEditing ? 'bg-slate-800/50' : ''}`}
                  placeholder={i18n.language === 'hi' ? 'वजन' : 'Weight'}
                />
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="pt-4 border-t border-slate-700">
            <h2 className="text-lg font-semibold mb-3 text-slate-300">
              {i18n.language === 'hi' ? '📊 खाता विवरण' : '📊 Account Details'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">
                  {i18n.language === 'hi' ? 'खाता बनाया गया:' : 'Account Created:'}
                </span>
                <p className="text-slate-300 mt-1">
                  {new Date(profile.created_at).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <span className="text-slate-500">
                  {i18n.language === 'hi' ? 'खाता प्रकार:' : 'Account Type:'}
                </span>
                <p className="text-slate-300 mt-1">
                  {profile.is_admin 
                    ? (i18n.language === 'hi' ? '👑 व्यवस्थापक' : '👑 Admin')
                    : (i18n.language === 'hi' ? '👤 उपयोगकर्ता' : '👤 User')
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {i18n.language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    {i18n.language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <h3 className="font-semibold text-blue-300 mb-2">
          {i18n.language === 'hi' ? 'ℹ️ क्यों यह जानकारी महत्वपूर्ण है?' : 'ℹ️ Why is this information important?'}
        </h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>
            {i18n.language === 'hi' 
              ? '• उम्र: बच्चों और बुजुर्गों के लिए खुराक समायोजन' 
              : '• Age: Dosage adjustments for children and elderly'}
          </li>
          <li>
            {i18n.language === 'hi' 
              ? '• लिंग: गर्भावस्था चेतावनी और विशिष्ट सिफारिशें' 
              : '• Gender: Pregnancy warnings and specific recommendations'}
          </li>
          <li>
            {i18n.language === 'hi' 
              ? '• वजन: सटीक दवा खुराक गणना' 
              : '• Weight: Accurate medicine dosage calculations'}
          </li>
        </ul>
      </div>
    </div>
  );
}
