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
  height: number | null;
  bmi?: number;
  bmi_category?: string;
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
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    weight: '',
    height: ''
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
  const response = await fetchWithAuth(API_ENDPOINTS.AUTH.PROFILE);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
        
        setFormData({
          full_name: data.full_name || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          weight: data.weight?.toString() || '',
          height: data.height?.toString() || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ 
          type: 'error', 
          text: i18n.language === 'hi' 
            ? 'प्रोफ़ाइल लोड करने में त्रुटि' 
            : 'Error loading profile' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [i18n.language]);

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || ''
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updateData = {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null
      };
      console.log('📤 Sending update:', updateData);
      console.log('📏 Height being sent:', updateData.height);

      const response = await fetchWithAuth(API_ENDPOINTS.AUTH.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update failed:', errorText);
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      console.log('📥 Received response:', updatedProfile);
      console.log('📏 Height in response:', updatedProfile.height);

      setProfile(updatedProfile);
      setFormData({
        full_name: updatedProfile.full_name || '',
        age: updatedProfile.age?.toString() || '',
        gender: updatedProfile.gender || '',
        weight: updatedProfile.weight?.toString() || '',
        height: updatedProfile.height?.toString() || ''
      });
      console.log('✅ Height updated in formData:', updatedProfile.height);

      // Force reload profile from backend to ensure state sync
      setTimeout(async () => {
        try {
          const resp = await fetchWithAuth(API_ENDPOINTS.AUTH.PROFILE);
          if (resp.ok) {
            const fresh = await resp.json();
            setProfile(fresh);
            setFormData({
              full_name: fresh.full_name || '',
              age: fresh.age?.toString() || '',
              gender: fresh.gender || '',
              weight: fresh.weight?.toString() || '',
              height: fresh.height?.toString() || ''
            });
            console.log('🔄 Forced profile reload, height:', fresh.height);
          }
        } catch (err) {
          console.error('❌ Error reloading profile:', err);
        }
      }, 500);

      setIsEditing(false);
      setMessage({ 
        type: 'success', 
        text: i18n.language === 'hi' ? '✅ परिवर्तन सहेजे गए! ऊंचाई: ' + (updatedProfile.height || 'N/A') + ' सेमी' : '✅ Changes saved! Height: ' + (updatedProfile.height || 'N/A') + ' cm'
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: i18n.language === 'hi' 
          ? '❌ प्रोफ़ाइल अपडेट करने में त्रुटि' 
          : '❌ Error updating profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Helper function for BMI styling
  const getBMIStyle = (category: string | undefined) => {
    switch (category) {
      case 'Normal':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/50',
          text: 'text-green-400',
          icon: '✅',
          message: i18n.language === 'hi' ? 'स्वस्थ वजन' : 'Healthy Weight'
        };
      case 'Underweight':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400',
          icon: '⚠️',
          message: i18n.language === 'hi' ? 'कम वजन' : 'Below Normal'
        };
      case 'Overweight':
        return {
          bg: 'bg-orange-500/20',
          border: 'border-orange-500/50',
          text: 'text-orange-400',
          icon: '⚡',
          message: i18n.language === 'hi' ? 'अधिक वजन' : 'Above Normal'
        };
      case 'Obese':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/50',
          text: 'text-red-400',
          icon: '🚨',
          message: i18n.language === 'hi' ? 'मोटापा' : 'High Risk'
        };
      default:
        return {
          bg: 'bg-slate-700/20',
          border: 'border-slate-600/50',
          text: 'text-slate-400',
          icon: '📊',
          message: i18n.language === 'hi' ? 'डेटा नहीं' : 'No Data'
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-slate-400">
            {i18n.language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-400 mb-4">
            {i18n.language === 'hi' 
              ? 'प्रोफ़ाइल लोड नहीं हो सका' 
              : 'Failed to Load Profile'}
          </h2>
          <p className="text-slate-400 mb-6">
            {i18n.language === 'hi' 
              ? 'कृपया पुनः प्रयास करें या लॉगिन करें' 
              : 'Please try again or log in'}
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              {i18n.language === 'hi' ? '🔄 पुनः प्रयास करें' : '🔄 Retry'}
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg transition-colors"
            >
              {i18n.language === 'hi' ? '🏠 होम पर जाएं' : '🏠 Go to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fix: bmiStyle definition
  const bmiStyle = getBMIStyle(profile.bmi_category);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <div className={`mb-4 p-4 rounded-lg border backdrop-blur-sm ${
          message.type === 'success' 
            ? 'bg-green-900/20 border-green-700/50 text-green-300' 
            : 'bg-red-900/20 border-red-700/50 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* BMI Dashboard Card */}
      {profile.bmi && profile.weight && profile.height && (
        <div className={`mb-6 p-6 rounded-xl border ${bmiStyle.bg} ${bmiStyle.border} backdrop-blur-sm`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{bmiStyle.icon}</span>
                <h3 className="text-xl font-semibold text-white">
                  {i18n.language === 'hi' ? 'BMI डैशबोर्ड' : 'BMI Dashboard'}
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">BMI</p>
                  <p className={`text-3xl font-bold ${bmiStyle.text}`}>
                    {profile.bmi.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    {i18n.language === 'hi' ? 'श्रेणी' : 'Category'}
                  </p>
                  <p className={`text-lg font-semibold ${bmiStyle.text}`}>
                    {profile.bmi_category}
                  </p>
                  <p className="text-xs text-slate-500">{bmiStyle.message}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    {i18n.language === 'hi' ? 'वजन' : 'Weight'}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {profile.weight} {i18n.language === 'hi' ? 'किलो' : 'kg'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    {i18n.language === 'hi' ? 'ऊंचाई' : 'Height'}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {profile.height} {i18n.language === 'hi' ? 'सेमी' : 'cm'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              {i18n.language === 'hi'
                ? '💡 BMI (बॉडी मास इंडेक्स) आपके वजन और ऊंचाई के आधार पर स्वास्थ्य श्रेणी दिखाता है'
                : '💡 BMI (Body Mass Index) shows your health category based on weight and height'}
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        {/* Edit/Cancel Button */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <span>✏️</span>
              <span>{i18n.language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</span>
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
              disabled={saving}
            >
              <span>❌</span>
              <span>{i18n.language === 'hi' ? 'रद्द करें' : 'Cancel'}</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📧</span>
              <h2 className="text-xl font-semibold text-cyan-400">
                {i18n.language === 'hi' ? 'खाता जानकारी' : 'Account Information'}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {i18n.language === 'hi' ? 'ईमेल' : 'Email'}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {i18n.language === 'hi' 
                    ? '⚠️ सुरक्षा कारणों से ईमेल नहीं बदला जा सकता' 
                    : '⚠️ Email cannot be changed for security reasons'}
                </p>
              </div>
              
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">
                  {i18n.language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  placeholder={i18n.language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                />
              </div>
            </div>
          </div>

          {/* Health Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏥</span>
              <h2 className="text-xl font-semibold text-purple-400">
                {i18n.language === 'hi' ? 'स्वास्थ्य जानकारी' : 'Health Information'}
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {i18n.language === 'hi' 
                ? '💊 यह जानकारी व्यक्तिगत दवा खुराक और BMI गणना के लिए उपयोग की जाती है' 
                : '💊 This information is used for personalized medicine dosage and BMI calculation'}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">
                  {i18n.language === 'hi' ? '🎂 उम्र (साल)' : '🎂 Age (years)'}
                </label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  placeholder={i18n.language === 'hi' ? 'उम्र' : 'Age'}
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-300 mb-2">
                  {i18n.language === 'hi' ? '👤 लिंग' : '👤 Gender'}
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                >
                  <option value="">{i18n.language === 'hi' ? 'चुनें' : 'Select'}</option>
                  <option value="M">{i18n.language === 'hi' ? 'पुरुष' : 'Male'}</option>
                  <option value="F">{i18n.language === 'hi' ? 'महिला' : 'Female'}</option>
                  <option value="O">{i18n.language === 'hi' ? 'अन्य' : 'Other'}</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-300 mb-2">
                  {i18n.language === 'hi' ? '⚖️ वजन (किलो)' : '⚖️ Weight (kg)'}
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
                  className={`w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  placeholder={i18n.language === 'hi' ? 'वजन' : 'Weight'}
                />
              </div>
              
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-slate-300 mb-2">
                  {i18n.language === 'hi' ? '📏 ऊंचाई (सेमी)' : '📏 Height (cm)'}
                </label>
                <input
                  id="height"
                  type="number"
                  min="50"
                  max="250"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    !isEditing ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                  placeholder={i18n.language === 'hi' ? 'ऊंचाई' : 'Height'}
                />
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-semibold text-blue-400">
                {i18n.language === 'hi' ? 'खाता विवरण' : 'Account Details'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">
                  {i18n.language === 'hi' ? 'खाता बनाया गया' : 'Account Created'}
                </p>
                <p className="text-white font-medium">
                  {new Date(profile.created_at).toLocaleDateString(
                    i18n.language === 'hi' ? 'hi-IN' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">
                  {i18n.language === 'hi' ? 'खाता प्रकार' : 'Account Type'}
                </p>
                <p className="text-white font-medium flex items-center gap-2">
                  {profile.is_admin ? (
                    <>
                      <span className="text-yellow-400">👑</span>
                      <span>{i18n.language === 'hi' ? 'एडमिन' : 'Admin'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-400">👤</span>
                      <span>{i18n.language === 'hi' ? 'यूज़र' : 'User'}</span>
                    </>
                  )}
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="font-medium">
                      {i18n.language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">💾</span>
                    <span className="font-medium">
                      {i18n.language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg backdrop-blur-sm">
        <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            {i18n.language === 'hi' ? 'क्यों यह जानकारी महत्वपूर्ण है?' : 'Why is this information important?'}
          </span>
        </h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>
              {i18n.language === 'hi' 
                ? 'उम्र: बच्चों और बुजुर्गों के लिए खुराक समायोजन' 
                : 'Age: Dosage adjustments for children and elderly'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>
              {i18n.language === 'hi' 
                ? 'लिंग: गर्भावस्था चेतावनी और विशिष्ट सिफारिशें' 
                : 'Gender: Pregnancy warnings and specific recommendations'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>
              {i18n.language === 'hi' 
                ? 'वजन और ऊंचाई: सटीक दवा खुराक गणना और BMI स्वास्थ्य ट्रैकिंग' 
                : 'Weight and Height: Accurate medicine dosage calculations and BMI health tracking'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
