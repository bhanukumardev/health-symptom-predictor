import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import {
  Notification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  generatePersonalizedNotification,
} from '../services/notificationService';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationUpdate: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose, onNotificationUpdate }) => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, showUnreadOnly]);

  // Load first name from localStorage for a lightweight greeting in the header
  useEffect(() => {
    try {
      const full = localStorage.getItem('user_full_name') || '';
      const f = full.trim().split(/\s+/)[0] || '';
      setFirstName(f || null);
    } catch {
      setFirstName(null);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications(showUnreadOnly);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      onNotificationUpdate();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      onNotificationUpdate();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      onNotificationUpdate();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const language = i18n.language === 'hi' ? 'hi' : 'en';
      await generatePersonalizedNotification(language);
      await fetchNotifications();
      onNotificationUpdate();
    } catch (error) {
      console.error('Error generating AI notification:', error);
      alert(t('notifications.generateError', 'Failed to generate AI notification. Please try again.'));
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />

      {/* Dropdown/Modal */}
      <div
        ref={dropdownRef}
        className="
          fixed md:absolute
          bottom-0 md:bottom-auto
          md:top-full md:right-0
          left-0 md:left-auto
          w-full md:w-96
          md:mt-2
          bg-gray-800 
          border border-gray-700 
          rounded-t-2xl md:rounded-lg 
          shadow-2xl 
          z-50
          max-h-[80vh] md:max-h-[600px]
          flex flex-col
          animate-slide-up md:animate-fade-in
        "
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          {firstName && (
            <div className="text-xs text-gray-400 mb-1">
              {i18n.language === 'hi' ? `नमस्ते ${firstName} 👋` : `Hi ${firstName} 👋`}
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🔔 {t('notifications.title', 'Notifications')}
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 md:hidden"
            >
              ✕
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="
                flex-1 min-w-[140px]
                px-3 py-2 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700
                text-white text-sm font-medium rounded-lg
                transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {generating ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  {t('notifications.generating', 'Generating...')}
                </>
              ) : (
                <>
                  🤖 {t('notifications.generateAI', 'AI Health Tip')}
                </>
              )}
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="
                  px-3 py-2
                  bg-gray-700 hover:bg-gray-600
                  text-white text-sm font-medium rounded-lg
                  transition-all
                "
              >
                ✓ {t('notifications.markAllRead', 'Mark All Read')}
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setShowUnreadOnly(false)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-all
                ${!showUnreadOnly ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              {t('notifications.all', 'All')}
            </button>
            <button
              onClick={() => setShowUnreadOnly(true)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg transition-all
                ${showUnreadOnly ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              {t('notifications.unreadOnly', 'Unread Only')}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin text-4xl">⚙️</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-3">🔔</div>
              <p className="text-gray-400 text-center">
                {showUnreadOnly
                  ? t('notifications.noUnread', 'No unread notifications')
                  : t('notifications.noNotifications', 'No notifications yet')}
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                {t('notifications.generateHint', 'Click "AI Health Tip" to get personalized health advice')}
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
