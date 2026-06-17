import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type NotifyType = 'success' | 'error' | 'warning' | 'info' | 'queue';

export interface NotifyItem {
  id: string;
  type: NotifyType;
  title: string;
  message?: string;
  duration: number;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

interface NotifyState {
  notifications: NotifyItem[];
  unreadCount: number;

  notify: (
    type: NotifyType,
    title: string,
    message?: string,
    options?: Partial<Pick<NotifyItem, 'duration' | 'data'>>
  ) => string;
  success: (title: string, message?: string, options?: Partial<Pick<NotifyItem, 'duration' | 'data'>>) => string;
  error: (title: string, message?: string, options?: Partial<Pick<NotifyItem, 'duration' | 'data'>>) => string;
  warning: (title: string, message?: string, options?: Partial<Pick<NotifyItem, 'duration' | 'data'>>) => string;
  info: (title: string, message?: string, options?: Partial<Pick<NotifyItem, 'duration' | 'data'>>) => string;
  queueNotify: (title: string, message?: string, options?: Partial<Pick<NotifyItem, 'duration' | 'data'>>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

const DEFAULT_DURATION: Record<NotifyType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  queue: 8000,
};

export const useNotifyStore = create<NotifyState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  notify: (type, title, message, options) => {
    const id = uuidv4();
    const duration = options?.duration ?? DEFAULT_DURATION[type];
    const item: NotifyItem = {
      id,
      type,
      title,
      message,
      duration,
      read: false,
      createdAt: new Date().toISOString(),
      data: options?.data,
    };

    set((state) => ({
      notifications: [item, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }

    return id;
  },

  success: (title, message, options) => {
    return get().notify('success', title, message, options);
  },

  error: (title, message, options) => {
    return get().notify('error', title, message, options);
  },

  warning: (title, message, options) => {
    return get().notify('warning', title, message, options);
  },

  info: (title, message, options) => {
    return get().notify('info', title, message, options);
  },

  queueNotify: (title, message, options) => {
    return get().notify('queue', title, message, options);
  },

  removeNotification: (id) => {
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      const wasUnread = target && !target.read;
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      const wasUnread = target && !target.read;
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
