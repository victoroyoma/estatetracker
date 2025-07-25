import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../store';
import { env } from './env';

/**
 * Real-time WebSocket integration for EstateTracker
 */

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  userId?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  protocols?: string[];
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private heartbeatInterval: number;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private onStateChange: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

  constructor(private config: WebSocketConfig, onStateChange: (state: string) => void) {
    this.maxReconnectAttempts = config.reconnectAttempts || 5;
    this.reconnectInterval = config.reconnectInterval || 3000;
    this.heartbeatInterval = config.heartbeatInterval || 30000;
    this.onStateChange = onStateChange;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.onStateChange('connecting');

    try {
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.onStateChange('error');
      this.scheduleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.onStateChange('connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.onStateChange('disconnected');
      this.stopHeartbeat();
      
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onStateChange('error');
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => callback(message.payload));
    }

    // Handle global message types
    this.listeners.get('*')?.forEach(callback => callback(message));
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('heartbeat', { timestamp: Date.now() });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectInterval}ms`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.onStateChange('error');
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  send(type: string, payload: any): void {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendMessage(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  subscribe(messageType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    
    this.listeners.get(messageType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(messageType)?.delete(callback);
    };
  }

  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
  }

  getState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'disconnected';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }
}

// React Hook for WebSocket
export function useWebSocket(config: WebSocketConfig) {
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsManager = useRef<WebSocketManager | null>(null);

  useEffect(() => {
    wsManager.current = new WebSocketManager(config, setConnectionState);
    wsManager.current.connect();

    // Subscribe to all messages
    const unsubscribe = wsManager.current.subscribe('*', (message: WebSocketMessage) => {
      setLastMessage(message);
    });

    return () => {
      unsubscribe();
      wsManager.current?.disconnect();
    };
  }, [config.url]);

  const sendMessage = useCallback((type: string, payload: any) => {
    wsManager.current?.send(type, payload);
  }, []);

  const subscribe = useCallback((messageType: string, callback: (data: any) => void) => {
    return wsManager.current?.subscribe(messageType, callback) || (() => {});
  }, []);

  return {
    connectionState,
    lastMessage,
    sendMessage,
    subscribe
  };
}

// Specific hooks for EstateTracker features
export function useEstateUpdates() {
  const { addNotification, updateEstate } = useAppStore();
  const config: WebSocketConfig = {
    url: env.WS_URL,
    protocols: ['estate-tracker']
  };

  const { connectionState, subscribe } = useWebSocket(config);

  useEffect(() => {
    const unsubscribeEstateUpdate = subscribe('estate:updated', (data: any) => {
      updateEstate(data.estateId, data.updates);
      addNotification({
        id: `estate-update-${Date.now()}`,
        userId: data.userId,
        title: 'Estate Updated',
        message: `Estate "${data.estateName}" has been updated`,
        type: 'info',
        read: false,
        createdAt: new Date()
      });
    });

    const unsubscribePlotUpdate = subscribe('plot:allocated', (data: any) => {
      addNotification({
        id: `plot-allocated-${Date.now()}`,
        userId: data.userId,
        title: 'Plot Allocated',
        message: `Plot ${data.plotNumber} has been allocated to ${data.ownerName}`,
        type: 'success',
        read: false,
        createdAt: new Date()
      });
    });

    const unsubscribeConstructionUpdate = subscribe('construction:progress', (data: any) => {
      addNotification({
        id: `construction-update-${Date.now()}`,
        userId: data.userId,
        title: 'Construction Update',
        message: `Construction progress updated: ${data.stageName} - ${data.progress}% complete`,
        type: 'info',
        read: false,
        createdAt: new Date()
      });
    });

    return () => {
      unsubscribeEstateUpdate();
      unsubscribePlotUpdate();
      unsubscribeConstructionUpdate();
    };
  }, [subscribe, updateEstate, addNotification]);

  return { connectionState };
}

// Real-time collaboration hooks
export function useRealTimeCollaboration(resourceType: string, resourceId: string) {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [userCursors, setUserCursors] = useState<Map<string, { x: number; y: number }>>(new Map());

  const config: WebSocketConfig = {
    url: `${env.WS_URL}/collaborate`,
    protocols: ['collaboration']
  };

  const { connectionState, sendMessage, subscribe } = useWebSocket(config);

  useEffect(() => {
    // Join collaboration room
    sendMessage('join:room', { resourceType, resourceId });

    const unsubscribeUserJoined = subscribe('user:joined', (data: { userId: string }) => {
      setActiveUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
    });

    const unsubscribeUserLeft = subscribe('user:left', (data: { userId: string }) => {
      setActiveUsers(prev => prev.filter(id => id !== data.userId));
      setUserCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
    });

    const unsubscribeCursorMove = subscribe('cursor:move', (data: { userId: string; x: number; y: number }) => {
      setUserCursors(prev => new Map(prev).set(data.userId, { x: data.x, y: data.y }));
    });

    return () => {
      sendMessage('leave:room', { resourceType, resourceId });
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribeCursorMove();
    };
  }, [resourceType, resourceId, sendMessage, subscribe]);

  const broadcastCursorPosition = useCallback((x: number, y: number) => {
    sendMessage('cursor:move', { x, y, resourceType, resourceId });
  }, [sendMessage, resourceType, resourceId]);

  return {
    connectionState,
    activeUsers,
    userCursors,
    broadcastCursorPosition
  };
}

// Document synchronization hook
export function useDocumentSync(documentId: string) {
  const [documentState, setDocumentState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const config: WebSocketConfig = {
    url: `${env.WS_URL}/documents`,
    protocols: ['document-sync']
  };

  const { connectionState, sendMessage, subscribe } = useWebSocket(config);

  useEffect(() => {
    // Request initial document state
    sendMessage('document:subscribe', { documentId });

    const unsubscribeDocumentState = subscribe('document:state', (data: any) => {
      setDocumentState(data);
      setIsLoading(false);
    });

    const unsubscribeDocumentUpdate = subscribe('document:update', (data: any) => {
      setDocumentState((prev: any) => ({ ...prev, ...data.changes }));
    });

    return () => {
      sendMessage('document:unsubscribe', { documentId });
      unsubscribeDocumentState();
      unsubscribeDocumentUpdate();
    };
  }, [documentId, sendMessage, subscribe]);

  const updateDocument = useCallback((changes: any) => {
    sendMessage('document:update', { documentId, changes });
  }, [sendMessage, documentId]);

  return {
    connectionState,
    documentState,
    isLoading,
    updateDocument
  };
}

export default {
  WebSocketManager,
  useWebSocket,
  useEstateUpdates,
  useRealTimeCollaboration,
  useDocumentSync
};
