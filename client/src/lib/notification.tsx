import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  platform: 'gmail' | 'slack' | 'whatsapp';
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false
      },
      ...prev
    ]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications = [
      {
        title: "New Slack Message",
        message: "Team update in #general channel",
        platform: "slack"
      },
      {
        title: "Gmail Priority",
        message: "Urgent email from manager",
        platform: "gmail"
      }
    ];

    mockNotifications.forEach(n => addNotification(n as Omit<Notification, 'id' | 'timestamp' | 'read'>));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
