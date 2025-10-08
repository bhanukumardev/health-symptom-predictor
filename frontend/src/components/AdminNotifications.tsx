import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, User, BrainCircuit, X } from 'lucide-react';
import { 
  createAdminNotification, 
  getUsersForNotifications, 
  broadcastAINotificationsToAll,
  AdminNotificationCreate 
} from '../services/notificationService';

interface UserForNotification {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  feedback_summary: {
    total_predictions: number;
    feedback_count: number;
    last_activity: string;
  };
}

interface AdminNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const notificationTemplates = {
  announcement: [
    { title: 'System Update', message: 'We have updated the system with new features.' },
    { title: 'Scheduled Maintenance', message: 'The system will be down for maintenance tonight.' },
  ],
  direct: [
    { title: 'Personal Reminder', message: 'Please check your health dashboard for updates.' },
    { title: 'Feedback Request', message: 'We value your feedback! Please let us know your thoughts.' },
  ],
};

const AdminNotifications: React.FC<AdminNotificationsProps> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'announcement' | 'direct' | 'ai'>('announcement');
  const [formData, setFormData] = useState({ title: '', message: '', selectedUserId: null });
  const [users, setUsers] = useState<UserForNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedTab === 'direct') {
      getUsersForNotifications().then(setUsers);
    }
  }, [isOpen, selectedTab]);

  const handleSendNotification = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedTab === 'direct' && !formData.selectedUserId) {
      alert('Please select a user for direct notification');
      return;
    }
    setLoading(true);
    try {
      const notificationData: AdminNotificationCreate = {
        title: formData.title,
        message: formData.message,
        type: selectedTab as 'announcement' | 'direct',
        user_id: selectedTab === 'direct' ? formData.selectedUserId : null
      };
      await createAdminNotification(notificationData);
      alert('Notification sent successfully!');
      setFormData({ title: '', message: '', selectedUserId: null });
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcastAI = async () => {
    if (!confirm('This will send AI-generated health tips to all users. Continue?')) {
      return;
    }
    setLoading(true);
    try {
      const result = await broadcastAINotificationsToAll('en');
      alert(`AI notifications sent to ${result.total_users} users!`);
    } catch (error) {
      console.error('Error broadcasting AI notifications:', error);
      alert('Failed to broadcast AI notifications');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            Admin Notifications
          </h2>
          <button 
            onClick={onClose}
            className="
              text-slate-400 hover:text-white transition-colors
              p-2 rounded-lg hover:bg-slate-700/50
              min-w-[44px] min-h-[44px] flex items-center justify-center
            "
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
          {/* Tabs - Mobile optimized */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => setSelectedTab('announcement')}
              className={`
                px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 
                font-medium transition-all duration-200
                min-h-[44px] sm:min-h-[36px]
                ${selectedTab === 'announcement' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              <Users className="w-4 h-4" />
              Announcement
            </button>
            <button
              onClick={() => setSelectedTab('direct')}
              className={`
                px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 
                font-medium transition-all duration-200
                min-h-[44px] sm:min-h-[36px]
                ${selectedTab === 'direct' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              <User className="w-4 h-4" />
              Direct Message
            </button>
            <button
              onClick={() => setSelectedTab('ai')}
              className={`
                px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 
                font-medium transition-all duration-200
                min-h-[44px] sm:min-h-[36px]
                ${selectedTab === 'ai' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              <BrainCircuit className="w-4 h-4" />
              AI Broadcast
            </button>
          </div>

          {/* Content based on selected tab */}
          {selectedTab === 'ai' ? (
            <div className="space-y-4">
              <div className="card p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm">
                <h3 className="text-base sm:text-lg font-medium mb-4">Broadcast AI Health Tips</h3>
                <p className="text-slate-400 mb-4 text-sm sm:text-base">
                  Send personalized AI-generated health tips to all users based on their prediction history and feedback.
                </p>
                <button
                  onClick={handleBroadcastAI}
                  disabled={loading}
                  className="
                    btn btn-primary flex items-center justify-center gap-2 w-full
                    py-3 sm:py-2 text-sm sm:text-base font-medium
                    min-h-[48px] sm:min-h-[44px]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  <BrainCircuit className="w-4 h-4" />
                  {loading ? 'Broadcasting...' : 'Broadcast AI Tips to All Users'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
              {/* Form */}
              <div className="space-y-4">
                <div className="card p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-medium mb-4">
                    {selectedTab === 'announcement' ? 'Create Announcement' : 'Send Direct Message'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="
                          w-full px-3 py-3 sm:py-2 
                          bg-slate-800 border border-slate-600 rounded-lg 
                          text-white placeholder-slate-400 
                          focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
                          min-h-[44px] sm:min-h-[36px]
                          text-base sm:text-sm
                        "
                        placeholder="Enter notification title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="
                          w-full px-3 py-3 sm:py-2 
                          bg-slate-800 border border-slate-600 rounded-lg 
                          text-white placeholder-slate-400 
                          focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
                          resize-none text-base sm:text-sm
                        "
                        placeholder="Enter your message..."
                      />
                    </div>

                    {/* Templates - Mobile optimized */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Quick Templates</label>
                      <div className="flex flex-col space-y-2">
                        {notificationTemplates[selectedTab].map((template, index) => (
                          <button
                            key={index}
                            onClick={() => setFormData({
                              ...formData,
                              title: template.title,
                              message: template.message
                            })}
                            className="
                              text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg w-full 
                              transition-all duration-200 
                              min-h-[44px] flex flex-col justify-center
                              border border-transparent hover:border-slate-600
                            "
                          >
                            <div className="font-medium text-sm">{template.title}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {template.message.length > 60 ? `${template.message.substring(0, 60)}...` : template.message}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedTab === 'direct' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Select User</label>
                        <select
                          value={formData.selectedUserId || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            selectedUserId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="
                            w-full px-3 py-3 sm:py-2 
                            bg-slate-800 border border-slate-600 rounded-lg 
                            text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
                            min-h-[44px] sm:min-h-[36px]
                            text-base sm:text-sm
                          "
                        >
                          <option value="">Choose a user...</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.full_name} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      onClick={handleSendNotification}
                      disabled={loading}
                      className="
                        btn btn-primary w-full flex items-center justify-center gap-2
                        py-3 sm:py-2 text-sm sm:text-base font-medium
                        min-h-[48px] sm:min-h-[44px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                      "
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : `Send ${selectedTab === 'announcement' ? 'Announcement' : 'Direct Message'}`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Users List - Mobile optimized */}
              <div className="card p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm">
                <h3 className="text-base sm:text-lg font-medium mb-4">Users Overview</h3>
                <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all duration-200
                        min-h-[44px] flex items-center
                        ${selectedTab === 'direct' && formData.selectedUserId === user.id
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg'
                          : 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/30'
                        }
                      `}
                      onClick={() => {
                        if (selectedTab === 'direct') {
                          setFormData({ ...formData, selectedUserId: user.id });
                        }
                      }}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base truncate">{user.full_name}</div>
                          <div className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</div>
                        </div>
                        <div className="text-right text-xs sm:text-sm text-slate-400 ml-2 flex-shrink-0">
                          <div>{user.feedback_summary.total_predictions} predictions</div>
                          <div>{user.feedback_summary.feedback_count} feedback</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
