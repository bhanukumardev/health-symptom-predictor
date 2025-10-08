import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
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

  const getIsMobile = () => typeof window !== 'undefined' && (window.innerWidth <= 900 || window.innerHeight <= 500);
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, showUnreadOnly]);

  useEffect(() => {
    try {
      const full = localStorage.getItem('user_full_name') || '';
      const f = full.trim().split(/\s+/)[0] || '';
      setFirstName(f || null);
    } catch {
      setFirstName(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (isMobile) {
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (isMobile) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };
  }, [isOpen, onClose, isMobile]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      const filtered = showUnreadOnly ? data.filter(n => !n.is_read) : data;
      setNotifications(filtered);
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
      alert('Failed to mark notification as read. Please try again.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      onNotificationUpdate();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      alert('Failed to mark all notifications as read. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      onNotificationUpdate();
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification. Please try again.');
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

  const modalContent = (
    <>
      {isMobile && (
        <div 
          className="notification-overlay fixed inset-0 bg-black/60 z-[9998]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={dropdownRef}
        className={`notification-modal ${isMobile ? 'notification-modal-mobile fixed bottom-0 left-0 right-0 w-full h-[90vh] z-[9999]' : 'notification-modal-desktop absolute top-full right-0 mt-2 w-96 z-[101]'} bg-gray-900 border border-gray-700 rounded-t-3xl md:rounded-xl shadow-2xl max-h-[90vh] md:max-h-[600px] flex flex-col animate-slide-up overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        style={isMobile ? {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          width: '100vw',
          maxWidth: '100vw',
          maxHeight: '90vh',
          borderRadius: '24px 24px 0 0',
          margin: 0,
          transform: 'translateY(0)'
        } : {
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          width: '24rem',
          zIndex: 101
        }}
      >
        <div className="p-4 pb-3 border-b border-gray-700 flex-shrink-0 sticky top-0 bg-gray-900 z-10">
          <div className="md:hidden w-12 h-1 bg-gray-600 rounded-full mx-auto mb-3"></div>
          {firstName && (
            <div className="text-xs text-gray-400 mb-1">
              {i18n.language === 'hi' ? `नमसत ${firstName} ` : `Hi ${firstName} `}
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <h3 id="notifications-title" className="text-lg font-bold text-white flex items-center gap-2">
               {t('notifications.title', 'Notifications')}
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-all duration-200 p-2.5 rounded-xl hover:bg-gray-700/70 active:bg-gray-600/50 min-w-[44px] min-h-[44px] flex items-center justify-center md:hidden border border-gray-600/50 hover:border-gray-500" aria-label={t('notifications.close', 'Close notifications')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button onClick={handleGenerateAI} disabled={generating} className="flex-1 min-w-0 px-3 py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[36px]">
              {generating ? (
                <>
                  <span className="animate-spin"></span>
                  {t('notifications.generating', 'Generating...')}
                </>
              ) : (
                <> {t('notifications.generateAI', 'AI Health Tip')}</>
              )}
            </button>
            {notifications.filter(n => !n.is_read).length > 0 && (
              <button onClick={handleMarkAllAsRead} className="px-3 py-2.5 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] sm:min-h-[36px] whitespace-nowrap">
                 {t('notifications.markAllRead', 'Mark All Read')}
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={() => setShowUnreadOnly(false)} className={`flex-1 sm:flex-none px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-h-[36px] flex items-center justify-center ${!showUnreadOnly ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {t('notifications.all', 'All')}
            </button>
            <button onClick={() => setShowUnreadOnly(true)} className={`flex-1 sm:flex-none px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 min-h-[36px] flex items-center justify-center ${showUnreadOnly ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {t('notifications.unreadOnly', 'Unread Only')}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin text-4xl"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-6xl mb-3"></div>
              <p className="text-gray-400 text-center">
                {showUnreadOnly ? t('notifications.noUnread', 'No unread notifications') : t('notifications.noNotifications', 'No notifications yet')}
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                {t('notifications.generateHint', 'Click "AI Health Tip" to get personalized health advice')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    const portalRoot = document.getElementById('modal-root') || document.body;
    return createPortal(modalContent, portalRoot);
  }
  return modalContent;
};

export default NotificationDropdown;