import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../services/notificationService';
import { useTranslation } from 'react-i18next';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead, onDelete }) => {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (notification.type) {
      case 'personalized':
        return '🤖'; // AI icon
      case 'announcement':
        return '📢'; // Megaphone
      case 'direct':
        return '📩'; // Message
      default:
        return '🔔';
    }
  };

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'personalized':
        return t('notifications.types.personalized', 'AI Health Tip');
      case 'announcement':
        return t('notifications.types.announcement', 'Announcement');
      case 'direct':
        return t('notifications.types.direct', 'Direct Message');
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('notifications.confirmDelete', 'Delete this notification?'))) {
      onDelete(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 border-b border-gray-700 cursor-pointer transition-all hover:bg-gray-700/30
        ${!notification.is_read ? 'bg-blue-500/10' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0 mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <h4 className={`text-sm font-semibold ${!notification.is_read ? 'text-white' : 'text-gray-300'}`}>
                {notification.title}
              </h4>
              <span className="text-xs text-gray-500">{getTypeLabel()}</span>
            </div>
            
            {/* Unread indicator */}
            {!notification.is_read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>

          {/* Message */}
          <p className={`text-sm mb-2 ${!notification.is_read ? 'text-gray-300' : 'text-gray-400'}`}>
            {notification.message}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500">
              {(() => {
                // Ensure consistent timezone handling: treat timestamps without timezone as UTC
                const raw = notification.created_at;
                const hasTZ = /[zZ]|[\+\-]\d{2}:?\d{2}$/.test(raw);
                const iso = hasTZ ? raw : `${raw.replace(' ', 'T').replace(/Z?$/, '')}Z`;
                const d = new Date(iso);
                return formatDistanceToNow(d, { addSuffix: true });
              })()}
            </span>

            {/* Delete button (only for non-announcement notifications) */}
            {notification.user_id !== null && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 hover:bg-red-500/10 rounded"
              >
                {t('notifications.delete', 'Delete')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
