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
    <div className="relative notification-bell">
      {/* Bell Button - Optimized for both desktop and mobile */}
      <button
        onClick={handleToggle}
        className="
          relative
          p-2 sm:p-2.5 md:p-3
          text-cyan-400 bg-slate-900/90 backdrop-blur-sm
          hover:text-white 
          hover:bg-cyan-700/80 
          rounded-full 
          transition-all duration-200
          min-w-[44px] min-h-[44px] 
          w-11 h-11 sm:w-12 sm:h-12
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          border border-slate-700/50
        "
        aria-label={t('notifications.title', 'Notifications')}
      >
        {/* Bell Icon - Responsive sizing */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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

        {/* Unread Badge - Better mobile touch target */}
        {stats.unread > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              bg-red-500 text-white
              text-xs font-bold
              min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-5
              flex items-center justify-center
              rounded-full
              px-1 sm:px-1.5
              animate-pulse
              shadow-lg
              border-2 border-slate-900
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

      {/* Notification Dropdown */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNotificationUpdate={handleNotificationUpdate}
      />
    </div>
  );
};

export default NotificationBell;
