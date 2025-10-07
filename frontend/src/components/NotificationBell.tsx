import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationDropdown from './NotificationDropdown';
import { getNotificationStats, NotificationStats } from '../services/notificationService';

const NotificationBell: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getNotificationStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationUpdate = () => {
    fetchStats();
  };

  return (
    <div className="fixed top-16 right-4 sm:top-6 sm:right-6 z-50">
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="
          relative
          p-3 md:p-3.5
          text-cyan-400 bg-slate-900 
          hover:text-white 
          hover:bg-cyan-700/80 
          rounded-full 
          transition-all
          min-w-[48px] min-h-[48px] w-12 h-12
          flex items-center justify-center
        "
        aria-label={t('notifications.title', 'Notifications')}
      >
        {/* Bell Icon */}
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {stats.unread > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              bg-red-500 text-white
              text-xs font-bold
              min-w-[20px] h-5
              flex items-center justify-center
              rounded-full
              px-1.5
              animate-pulse
              shadow-lg
            "
          >
            {stats.unread > 99 ? '99+' : stats.unread}
          </span>
        )}

        {/* Loading Indicator */}
        {loading && (
          <span className="absolute -bottom-1 -right-1 w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown - mobile full width */}
      <div className="sm:hidden fixed inset-0 w-full h-full z-50 bg-black bg-opacity-60">
        <NotificationDropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onNotificationUpdate={handleNotificationUpdate}
        />
      </div>
      <div className="hidden sm:block">
        <NotificationDropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onNotificationUpdate={handleNotificationUpdate}
        />
      </div>
    </div>
  );
};

export default NotificationBell;
