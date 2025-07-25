import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, Star, MessageSquare, TrendingUp, MapPin, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { useWebSocketContext } from '../../providers/WebSocketProvider';
import { useAppStore } from '../../store';
import { formatDistanceToNow } from 'date-fns';

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'ai-insight' | 'priority';
  category: 'estate' | 'payment' | 'document' | 'chat' | 'analytics' | 'system';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  aiInsight?: {
    confidence: number;
    recommendation: string;
    impact: 'low' | 'medium' | 'high';
  };
  metadata?: {
    estateId?: string;
    userId?: string;
    amount?: number;
    documentType?: string;
  };
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartNotificationSystem: React.FC<NotificationSystemProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'ai-insights' | 'priority'>('all');
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { subscribe } = useWebSocketContext();
  useAppStore();

  // Check and request notification permissions
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setIsPermissionGranted(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          setIsPermissionGranted(permission === 'granted');
        });
      }
    }
  }, []);

  // Mock notifications with AI insights
  useEffect(() => {
    const mockNotifications: SmartNotification[] = [
      {
        id: '1',
        title: 'AI Market Insight',
        message: 'Property values in Green Valley Estate are trending 15% above market average',
        type: 'ai-insight',
        category: 'analytics',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isRead: false,
        aiInsight: {
          confidence: 0.92,
          recommendation: 'Consider promoting premium plot sales',
          impact: 'high'
        },
        metadata: { estateId: 'estate-1' }
      },
      {
        id: '2',
        title: 'Payment Due Alert',
        message: 'Oluwaseun Adeyemi has a payment due in 2 days',
        type: 'warning',
        category: 'payment',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        actionUrl: '/payments',
        metadata: { userId: 'user-123', amount: 2500000 }
      },
      {
        id: '3',
        title: 'Document Verification Complete',
        message: 'Certificate of Occupancy verified successfully using AI',
        type: 'success',
        category: 'document',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false,
        actionUrl: '/ai-processor'
      },
      {
        id: '4',
        title: 'New Message',
        message: 'You have 3 new messages in Estate Developer Chat',
        type: 'info',
        category: 'chat',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        actionUrl: '/chat'
      },
      {
        id: '5',
        title: 'Critical System Alert',
        message: 'Unusual activity detected in payment processing',
        type: 'error',
        category: 'system',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: false,
        aiInsight: {
          confidence: 0.87,
          recommendation: 'Review transactions from last 24 hours',
          impact: 'high'
        }
      },
      {
        id: '6',
        title: 'Construction Progress Update',
        message: 'Phase 2 construction is 85% complete - ahead of schedule!',
        type: 'success',
        category: 'estate',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        metadata: { estateId: 'estate-2' }
      },
      {
        id: '7',
        title: 'Smart Recommendation',
        message: 'AI suggests scheduling client meetings during peak engagement hours (2-4 PM)',
        type: 'ai-insight',
        category: 'analytics',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: false,
        aiInsight: {
          confidence: 0.78,
          recommendation: 'Schedule meetings between 2-4 PM for better engagement',
          impact: 'medium'
        }
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = subscribe('notifications', (data: any) => {
      const newNotification: SmartNotification = {
        id: data.id || Math.random().toString(36).substr(2, 9),
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        category: data.category || 'system',
        timestamp: new Date(),
        isRead: false,
        actionUrl: data.actionUrl,
        aiInsight: data.aiInsight,
        metadata: data.metadata
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Show browser notification if permission granted
      if (isPermissionGranted && !data.isRead) {
        showBrowserNotification(newNotification);
      }
    });

    return unsubscribe;
  }, [subscribe, isPermissionGranted]);

  const showBrowserNotification = (notification: SmartNotification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      setTimeout(() => browserNotification.close(), 5000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'ai-insights':
        return notifications.filter(n => n.type === 'ai-insight');
      case 'priority':
        return notifications.filter(n => n.type === 'error' || n.type === 'warning' || n.aiInsight?.impact === 'high');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (notification: SmartNotification) => {
    switch (notification.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'ai-insight':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'analytics':
        return <TrendingUp className="w-4 h-4" />;
      case 'estate':
        return <MapPin className="w-4 h-4" />;
      case 'payment':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Smart Notifications</h2>
              <p className="text-sm text-gray-600">AI-powered insights and updates</p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-4">
            {(['all', 'unread', 'ai-insights', 'priority'] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className="capitalize"
              >
                {filterOption.replace('-', ' ')}
              </Button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {getFilteredNotifications().length} notifications
            </p>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {getFilteredNotifications().length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(notification.category)}
                          <span className="text-xs text-gray-500 capitalize">
                            {notification.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>

                      {notification.aiInsight && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium text-purple-700">
                              AI Insight ({Math.round(notification.aiInsight.confidence * 100)}% confidence)
                            </span>
                            <Badge 
                              variant="default" 
                              className={`text-xs ${
                                notification.aiInsight.impact === 'high' ? 'border-red-300 text-red-700' :
                                notification.aiInsight.impact === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-green-300 text-green-700'
                              }`}
                            >
                              {notification.aiInsight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-purple-700">
                            {notification.aiInsight.recommendation}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = notification.actionUrl!}
                            >
                              View
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartNotificationSystem;
