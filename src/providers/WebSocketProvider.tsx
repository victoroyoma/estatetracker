import React, { createContext, useContext, ReactNode, useRef, useState, useEffect } from 'react';
import { WebSocketManager, WebSocketConfig } from '../lib/websocket';
import { env } from '../lib/env';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (channel: string, callback: (data: any) => void) => () => void;
  send: (type: string, data: any) => void;
  connectionState: string;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const managerRef = useRef<WebSocketManager | null>(null);

  useEffect(() => {
    const config: WebSocketConfig = {
      url: env.WS_URL,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
    };

    managerRef.current = new WebSocketManager(config, (state) => {
      setConnectionState(state);
      setIsConnected(state === 'connected');
    });

    managerRef.current.connect();

    return () => {
      managerRef.current?.disconnect();
    };
  }, []);

  const contextValue: WebSocketContextType = {
    isConnected,
    connectionState,
    subscribe: (channel: string, callback: (data: any) => void) => {
      return managerRef.current?.subscribe(channel, callback) || (() => {});
    },
    send: (type: string, data: any) => {
      if (managerRef.current) {
        managerRef.current.send(type, data);
      }
    },
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
