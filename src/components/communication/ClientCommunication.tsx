import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  Mail, 
  Bell, 
  Search,
  Plus,
  CheckCircle,
  Clock,
  Paperclip,
  Mic,
  Image,
  Calendar
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate } from '../../lib/utils';

// Simple time formatting utility
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'developer' | 'admin';
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  status: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  conversationId: string;
}

interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Conversation {
  id: string;
  participantIds: string[];
  participants: ConversationParticipant[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  title?: string;
  plotId?: string;
  plotNumber?: string;
  estateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationParticipant {
  id: string;
  name: string;
  role: 'client' | 'developer' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'payment' | 'construction' | 'urgent';
  authorId: string;
  authorName: string;
  publishDate: Date;
  isPublished: boolean;
  targetAudience: 'all' | 'clients' | 'developers' | 'specific';
  targetIds?: string[];
  readBy: string[];
  estateId?: string;
  plotIds?: string[];
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    messages: boolean;
    announcements: boolean;
    payments: boolean;
    construction: boolean;
    documents: boolean;
  };
}

const ClientCommunication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'notifications'>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState('user-1'); // Mock current user

  useEffect(() => {
    loadCommunicationData();
  }, []);

  const loadCommunicationData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConversations(),
        loadAnnouncements()
      ]);
    } catch (error) {
      console.error('Error loading communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participantIds: ['user-1', 'user-2'],
        participants: [
          {
            id: 'user-1',
            name: 'John Okafor',
            role: 'client',
            isOnline: true
          },
          {
            id: 'user-2',
            name: 'Green Valley Developer',
            role: 'developer',
            isOnline: false,
            lastSeen: new Date('2024-12-02T15:30:00')
          }
        ],
        lastMessage: {
          id: 'msg-1',
          senderId: 'user-2',
          senderName: 'Green Valley Developer',
          senderRole: 'developer',
          receiverId: 'user-1',
          receiverName: 'John Okafor',
          content: 'Your construction documents are ready for review.',
          timestamp: new Date('2024-12-02T16:00:00'),
          type: 'text',
          status: 'delivered',
          conversationId: 'conv-1'
        },
        unreadCount: 2,
        isGroup: false,
        plotId: 'plot-a12',
        plotNumber: 'A12',
        estateId: 'estate-1',
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-12-02T16:00:00')
      },
      {
        id: 'conv-2',
        participantIds: ['user-1', 'user-3', 'user-4'],
        participants: [
          {
            id: 'user-1',
            name: 'John Okafor',
            role: 'client',
            isOnline: true
          },
          {
            id: 'user-3',
            name: 'Mary Adebayo',
            role: 'client',
            isOnline: true
          },
          {
            id: 'user-4',
            name: 'Estate Manager',
            role: 'admin',
            isOnline: false,
            lastSeen: new Date('2024-12-02T12:00:00')
          }
        ],
        lastMessage: {
          id: 'msg-2',
          senderId: 'user-3',
          senderName: 'Mary Adebayo',
          senderRole: 'client',
          receiverId: 'user-1',
          receiverName: 'John Okafor',
          content: 'Thanks for sharing the infrastructure update!',
          timestamp: new Date('2024-12-02T14:30:00'),
          type: 'text',
          status: 'read',
          conversationId: 'conv-2'
        },
        unreadCount: 0,
        isGroup: true,
        title: 'Green Valley Residents',
        estateId: 'estate-1',
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-12-02T14:30:00')
      }
    ];
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
      loadMessages(mockConversations[0].id);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'John Okafor',
        senderRole: 'client',
        receiverId: 'user-2',
        receiverName: 'Green Valley Developer',
        content: 'Hi, I wanted to check on the status of my plot construction.',
        timestamp: new Date('2024-12-01T10:00:00'),
        type: 'text',
        status: 'read',
        conversationId: conversationId
      },
      {
        id: 'msg-2',
        senderId: 'user-2',
        senderName: 'Green Valley Developer',
        senderRole: 'developer',
        receiverId: 'user-1',
        receiverName: 'John Okafor',
        content: 'Hello John! Your plot construction is progressing well. We\'ve completed the foundation and are starting the block work.',
        timestamp: new Date('2024-12-01T10:15:00'),
        type: 'text',
        status: 'read',
        conversationId: conversationId
      },
      {
        id: 'msg-3',
        senderId: 'user-2',
        senderName: 'Green Valley Developer',
        senderRole: 'developer',
        receiverId: 'user-1',
        receiverName: 'John Okafor',
        content: 'I\'ve attached some progress photos for your review.',
        timestamp: new Date('2024-12-01T10:16:00'),
        type: 'image',
        status: 'read',
        conversationId: conversationId,
        attachments: [
          {
            id: 'att-1',
            name: 'construction_progress_1.jpg',
            type: 'image/jpeg',
            size: 1024000,
            url: '/attachments/construction_progress_1.jpg'
          }
        ]
      },
      {
        id: 'msg-4',
        senderId: 'user-1',
        senderName: 'John Okafor',
        senderRole: 'client',
        receiverId: 'user-2',
        receiverName: 'Green Valley Developer',
        content: 'Thank you for the update! The progress looks great. When do you expect to complete the roofing?',
        timestamp: new Date('2024-12-02T09:00:00'),
        type: 'text',
        status: 'read',
        conversationId: conversationId
      },
      {
        id: 'msg-5',
        senderId: 'user-2',
        senderName: 'Green Valley Developer',
        senderRole: 'developer',
        receiverId: 'user-1',
        receiverName: 'John Okafor',
        content: 'Your construction documents are ready for review.',
        timestamp: new Date('2024-12-02T16:00:00'),
        type: 'text',
        status: 'delivered',
        conversationId: conversationId
      }
    ];
    setMessages(mockMessages.filter(m => m.conversationId === conversationId));
  };

  const loadAnnouncements = async () => {
    const mockAnnouncements: Announcement[] = [
      {
        id: 'ann-1',
        title: 'Infrastructure Maintenance Schedule',
        content: 'Dear residents, we will be conducting routine maintenance on the estate infrastructure from December 15-17, 2024. Water supply may be temporarily affected between 9 AM - 12 PM daily.',
        type: 'maintenance',
        authorId: 'admin-1',
        authorName: 'Estate Management',
        publishDate: new Date('2024-12-01T08:00:00'),
        isPublished: true,
        targetAudience: 'all',
        readBy: ['user-1', 'user-3'],
        estateId: 'estate-1'
      },
      {
        id: 'ann-2',
        title: 'Payment Reminder - Development Levy',
        content: 'This is a friendly reminder that the development levy payment for Q4 2024 is due on December 31, 2024. Please ensure timely payment to avoid penalties.',
        type: 'payment',
        authorId: 'admin-1',
        authorName: 'Finance Team',
        publishDate: new Date('2024-11-28T10:00:00'),
        isPublished: true,
        targetAudience: 'clients',
        readBy: ['user-1'],
        estateId: 'estate-1'
      },
      {
        id: 'ann-3',
        title: 'New Amenity: Community Center Opening',
        content: 'We are excited to announce the opening of our new community center on January 15, 2025. The facility will include a gym, meeting rooms, and recreational areas.',
        type: 'general',
        authorId: 'admin-1',
        authorName: 'Estate Management',
        publishDate: new Date('2024-12-01T14:00:00'),
        isPublished: true,
        targetAudience: 'all',
        readBy: [],
        estateId: 'estate-1'
      },
      {
        id: 'ann-4',
        title: 'Security Alert: Enhanced Gate Protocols',
        content: 'For enhanced security, we are implementing new access protocols. All visitors must now be pre-registered through the estate app or with the security team.',
        type: 'urgent',
        authorId: 'admin-1',
        authorName: 'Security Team',
        publishDate: new Date('2024-12-03T06:00:00'),
        isPublished: true,
        targetAudience: 'all',
        readBy: ['user-1'],
        estateId: 'estate-1'
      }
    ];
    setAnnouncements(mockAnnouncements);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'Current User',
      senderRole: 'client',
      receiverId: selectedConversation.participants.find(p => p.id !== currentUserId)?.id || '',
      receiverName: selectedConversation.participants.find(p => p.id !== currentUserId)?.name || '',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent',
      conversationId: selectedConversation.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const getAnnouncementTypeColor = (type: string): string => {
    switch (type) {
      case 'urgent': return 'danger';
      case 'maintenance': return 'warning';
      case 'payment': return 'primary';
      case 'construction': return 'secondary';
      case 'general': return 'success';
      default: return 'default';
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'read': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || (conv.plotNumber && conv.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ann.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'notifications', label: 'Notification Settings', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Conversations</h3>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">
                              {conversation.isGroup 
                                ? conversation.title 
                                : conversation.participants.find(p => p.id !== currentUserId)?.name
                              }
                            </h4>
                            {conversation.participants.some(p => p.isOnline && p.id !== currentUserId) && (
                              <div className="ml-2 h-2 w-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          {conversation.plotNumber && (
                            <p className="text-xs text-gray-500">Plot {conversation.plotNumber}</p>
                          )}
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-primary-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">
                          {selectedConversation.isGroup 
                            ? selectedConversation.title 
                            : selectedConversation.participants.find(p => p.id !== currentUserId)?.name
                          }
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.plotNumber && `Plot ${selectedConversation.plotNumber} • `}
                          {selectedConversation.participants.length} participant{selectedConversation.participants.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${
                            message.senderId === currentUserId
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          } rounded-lg px-4 py-2`}>
                            {message.senderId !== currentUserId && (
                              <p className="text-xs font-medium mb-1">{message.senderName}</p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map(attachment => (
                                  <div key={attachment.id} className="flex items-center text-xs">
                                    <Paperclip className="h-3 w-3 mr-1" />
                                    {attachment.name}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs opacity-75">
                                {formatTime(message.timestamp)}
                              </p>
                              {message.senderId === currentUserId && (
                                <div className="ml-2">
                                  {getMessageStatusIcon(message.status)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <Button size="sm" variant="outline">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="urgent">Urgent</option>
              <option value="maintenance">Maintenance</option>
              <option value="payment">Payment</option>
              <option value="construction">Construction</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium mr-2">{announcement.title}</h3>
                        <Badge variant={getAnnouncementTypeColor(announcement.type) as any}>
                          {announcement.type}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(announcement.publishDate)}
                        <span className="mx-2">•</span>
                        <span>By {announcement.authorName}</span>
                      </div>
                    </div>
                    {!announcement.readBy.includes(currentUserId) && (
                      <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{announcement.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{announcement.readBy.length} people have read this</span>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Notification Settings Tab */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <p className="text-sm text-gray-600">
                Choose how you want to be notified about important updates
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">Notification Methods</h4>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', icon: Mail },
                    { key: 'sms', label: 'SMS Notifications', icon: MessageSquare },
                    { key: 'push', label: 'Push Notifications', icon: Bell },
                    { key: 'inApp', label: 'In-App Notifications', icon: Bell }
                  ].map(method => (
                    <div key={method.key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <method.icon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium">{method.label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium mb-4">Notification Types</h4>
                <div className="space-y-4">
                  {[
                    { key: 'messages', label: 'New Messages' },
                    { key: 'announcements', label: 'Announcements' },
                    { key: 'payments', label: 'Payment Reminders' },
                    { key: 'construction', label: 'Construction Updates' },
                    { key: 'documents', label: 'Document Updates' }
                  ].map(type => (
                    <div key={type.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{type.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button variant="primary">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientCommunication;
