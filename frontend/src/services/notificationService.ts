import api from './api';

// Types
export interface Notification {
  id: number;
  user_id: number | null;
  title: string;
  message: string;
  type: 'personalized' | 'announcement' | 'direct';
  created_at: string;
  is_read: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

export interface AdminNotificationCreate {
  title: string;
  message: string;
  type: 'announcement' | 'direct';
  user_id?: number | null;
}

// User notification services
export const getNotifications = async (unreadOnly: boolean = false): Promise<Notification[]> => {
  const response = await api.get('/api/notifications', {
    params: { unread_only: unreadOnly }
  });
  return response.data;
};

export const getNotificationStats = async (): Promise<NotificationStats> => {
  const response = await api.get('/api/notifications/stats');
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<Notification> => {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  const response = await api.patch('/api/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/api/notifications/${id}`);
  return response.data;
};

export const generatePersonalizedNotification = async (language: string = 'en'): Promise<Notification> => {
  const response = await api.post('/api/notifications/personalized', null, {
    params: { language }
  });
  return response.data;
};

// Admin notification services
export const createAdminNotification = async (data: AdminNotificationCreate): Promise<Notification> => {
  const response = await api.post('/api/notifications/admin/create', data);
  return response.data;
};

export const getUsersForNotifications = async (): Promise<any[]> => {
  const response = await api.get('/api/notifications/admin/users');
  return response.data;
};

export const broadcastAINotificationsToAll = async (language: string = 'en'): Promise<{ message: string; total_users: number }> => {
  const response = await api.post('/api/notifications/admin/broadcast-ai', null, {
    params: { language }
  });
  return response.data;
};
