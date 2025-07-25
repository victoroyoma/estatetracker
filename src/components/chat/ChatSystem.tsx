import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Paperclip, Smile, Search, Settings, Users, MessageCircle } from 'lucide-react';
import { CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useWebSocketContext } from '../../providers/WebSocketProvider';
import { useAppStore } from '../../store';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  chatId: string;
}

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'estate' | 'support';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
  estateId?: string;
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ isOpen, onClose }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { subscribe, send } = useWebSocketContext();
  const { user } = useAppStore();

  // Mock chats data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Green Valley Developers',
      type: 'estate',
      participants: ['user1', 'user2', 'user3'],
      unreadCount: 3,
      isOnline: true,
      estateId: '1',
      lastMessage: {
        id: 'm1',
        senderId: 'user2',
        senderName: 'John Developer',
        content: 'The construction progress for Block A is ahead of schedule!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        isRead: false,
        chatId: '1'
      }
    },
    {
      id: '2',
      name: 'Oluwaseun Adeyemi',
      type: 'direct',
      participants: ['user1', 'client1'],
      unreadCount: 1,
      isOnline: true,
      lastMessage: {
        id: 'm2',
        senderId: 'client1',
        senderName: 'Oluwaseun Adeyemi',
        content: 'When will the roofing be completed?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'text',
        isRead: false,
        chatId: '2'
      }
    },
    {
      id: '3',
      name: 'Support Team',
      type: 'support',
      participants: ['user1', 'support1'],
      unreadCount: 0,
      isOnline: true,
      lastMessage: {
        id: 'm3',
        senderId: 'support1',
        senderName: 'Support Agent',
        content: 'Your document verification request has been processed.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        isRead: true,
        chatId: '3'
      }
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: 'user2',
      senderName: 'John Developer',
      content: 'Good morning everyone! I wanted to update you on the progress of Green Valley Estate.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text',
      isRead: true,
      chatId: '1'
    },
    {
      id: 'm2',
      senderId: 'user3',
      senderName: 'Maria Construction',
      content: 'The foundation work for plots A1-A5 has been completed successfully.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'text',
      isRead: true,
      chatId: '1'
    },
    {
      id: 'm3',
      senderId: 'user1',
      senderName: 'You',
      content: 'That\'s excellent news! How about the electrical work?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      isRead: true,
      chatId: '1'
    },
    {
      id: 'm4',
      senderId: 'user2',
      senderName: 'John Developer',
      content: 'The construction progress for Block A is ahead of schedule!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      isRead: false,
      chatId: '1'
    }
  ]);

  useEffect(() => {
    if (isOpen && selectedChat) {
      scrollToBottom();
    }
  }, [messages, isOpen, selectedChat]);

  useEffect(() => {
    // Subscribe to chat events
    const unsubscribeMessage = subscribe('chat:message', handleNewMessage);
    const unsubscribeTyping = subscribe('chat:typing', handleTyping);
    
    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
    };
  }, [subscribe]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (data: Message) => {
    setMessages(prev => [...prev, data]);
    
    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === data.chatId 
        ? { 
            ...chat, 
            lastMessage: data,
            unreadCount: data.senderId !== user?.id ? chat.unreadCount + 1 : chat.unreadCount
          }
        : chat
    ));
  };

  const handleTyping = (data: { userId: string; chatId: string; isTyping: boolean }) => {
    if (data.isTyping) {
      setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
    } else {
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat || !user) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: message.trim(),
      timestamp: new Date(),
      type: 'text',
      isRead: false,
      chatId: selectedChat.id
    };

    // Send via WebSocket
    send('chat:message', newMessage);
    
    // Add to local state
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      send('chat:typing', { chatId: selectedChat?.id, isTyping: true });
    } else if (isTyping && value.length === 0) {
      setIsTyping(false);
      send('chat:typing', { chatId: selectedChat?.id, isTyping: false });
    }
  };

  const getChatIcon = (chat: Chat) => {
    switch (chat.type) {
      case 'estate':
        return <MessageCircle className="h-5 w-5" />;
      case 'support':
        return <Settings className="h-5 w-5" />;
      case 'group':
        return <Users className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChatMessages = selectedChat 
    ? messages.filter(msg => msg.chatId === selectedChat.id)
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden">
        
        {/* Chat List Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {getChatIcon(chat)}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">
                        {chat.name}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge variant="primary" className="ml-2">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {chat.lastMessage && (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage.content}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {getChatIcon(selectedChat)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedChat.type === 'estate' && `Estate Chat • ${selectedChat.participants.length} members`}
                        {selectedChat.type === 'direct' && (selectedChat.isOnline ? 'Online' : 'Offline')}
                        {selectedChat.type === 'support' && 'Support Team'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      msg.senderId === user?.id 
                        ? 'bg-primary-500 text-white rounded-l-lg rounded-tr-lg' 
                        : 'bg-gray-200 text-gray-900 rounded-r-lg rounded-tl-lg'
                    } px-4 py-2`}>
                      {msg.senderId !== user?.id && (
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 opacity-75 ${
                        msg.senderId === user?.id ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={1}
                    />
                    <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
