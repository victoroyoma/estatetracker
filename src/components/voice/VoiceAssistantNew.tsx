import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Bot, 
  User, 
  Zap, 
  Settings
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { generateCompleteDataset } from '../../lib/mockData';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { useAppStore } from '../../store';

// Web Speech API interfaces
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  confidence: number;
  action?: 'search' | 'navigate' | 'create' | 'update' | 'analytics';
  parameters?: Record<string, any>;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  commands?: string[];
}

interface VoiceSettings {
  language: 'en-US' | 'en-NG' | 'ig-NG' | 'yo-NG' | 'ha-NG';
  voice: 'male' | 'female' | 'neutral';
  speed: number;
  pitch: number;
  volume: number;
  autoSpeak: boolean;
  wakeWord: string;
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([]);
  const [settings] = useState<VoiceSettings>({
    language: 'en-US',
    voice: 'female',
    speed: 1,
    pitch: 1,
    volume: 0.8,
    autoSpeak: true,
    wakeWord: 'Hey EstateTracker'
  });
  const [transcript, setTranscript] = useState('');
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get app state and data
  const { user, addNotification } = useAppStore();
  
  // Generate comprehensive mock data
  const mockDataset = useMemo(() => generateCompleteDataset(), []);
  
  // Quick stats from mock data
  const liveStats = useMemo(() => {
    const estates = mockDataset.estates;
    const plots = mockDataset.plots;
    const allocatedPlots = plots.filter(plot => plot.ownerId).length;
    const totalRevenue = estates.reduce((sum, estate) => 
      sum + (estate.totalPlots * 12000000), 0); // Average plot price
    
    return {
      totalEstates: estates.length,
      totalPlots: plots.length,
      allocatedPlots,
      availablePlots: plots.length - allocatedPlots,
      totalRevenue,
      occupancyRate: Math.round((allocatedPlots / plots.length) * 100),
      activeConstruction: plots.filter(plot => plot.status === 'construction').length,
      completedProjects: plots.filter(plot => plot.status === 'developed').length
    };
  }, [mockDataset]);

  useEffect(() => {
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    loadInitialMessages();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = settings.language;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(interimTranscript);

          if (finalTranscript) {
            processVoiceCommand(finalTranscript, event.results[event.resultIndex][0].confidence);
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Show user-friendly error message
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'assistant',
            content: 'Sorry, I encountered an issue with speech recognition. Please check your microphone permissions and try again.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setTranscript('');
        };
      }
    } else {
      // Fallback for unsupported browsers
      console.warn('Speech recognition not supported in this browser');
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Voice recognition is not supported in your browser. Please use a modern browser like Chrome, Edge, or Safari for the best experience.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  };

  const loadInitialMessages = () => {
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'assistant',
        content: 'Hello! I\'m your EstateTracker voice assistant. You can ask me about your properties, analytics, or any estate management tasks. Try saying "Show me my estate analytics" or "Create a new property".',
        timestamp: new Date(),
        commands: ['estate analytics', 'create property', 'show plots', 'payment status']
      }
    ];
    setMessages(initialMessages);
  };

  const processVoiceCommand = async (command: string, confidence: number) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: command,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Analyze command and generate response
    const response = await analyzeCommand(command);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.message,
      timestamp: new Date(),
      commands: response.suggestions
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Record command
    const voiceCommand: VoiceCommand = {
      id: Date.now().toString(),
      command,
      response: response.message,
      timestamp: new Date(),
      confidence,
      action: response.action as VoiceCommand['action'],
      parameters: response.parameters
    };

    setRecentCommands(prev => [voiceCommand, ...prev.slice(0, 9)]);

    // Speak response if auto-speak is enabled
    if (settings.autoSpeak) {
      speakText(response.message);
    }

    // Execute action if any
    if (response.action) {
      executeAction(response.action, response.parameters);
    }
  };

  const analyzeCommand = async (command: string): Promise<{
    message: string;
    action?: string;
    parameters?: Record<string, any>;
    suggestions?: string[];
  }> => {
    const lowerCommand = command.toLowerCase();
    
    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    // Real-time Statistics Commands
    if (lowerCommand.includes('stats') || lowerCommand.includes('statistics') || lowerCommand.includes('overview')) {
      const stats = liveStats;
      return {
        message: `Here are your current estate statistics: You have ${stats.totalEstates} estates with ${formatNumber(stats.totalPlots)} total plots. ${stats.allocatedPlots} plots are allocated (${stats.occupancyRate}% occupancy), with ${stats.activeConstruction} under construction and ${stats.completedProjects} completed. Total portfolio value is ${formatCurrency(stats.totalRevenue)}.`,
        action: 'display_stats',
        parameters: { stats },
        suggestions: ['show revenue breakdown', 'estate performance', 'occupancy details']
      };
    }

    // Estate Analytics
    if (lowerCommand.includes('analytics') || lowerCommand.includes('dashboard') || lowerCommand.includes('performance')) {
      return {
        message: 'I\'ll show you the comprehensive analytics dashboard with revenue trends, occupancy rates, and performance metrics across all your estates.',
        action: 'navigate',
        parameters: { route: '/analytics' },
        suggestions: ['show revenue trends', 'plot occupancy rates', 'client statistics']
      };
    }

    // Property Search with AI
    if (lowerCommand.includes('find') || lowerCommand.includes('search') || lowerCommand.includes('look for')) {
      const searchTerm = extractSearchTerm(command);
      const matchedPlots = mockDataset.plots.filter(plot => 
        plot.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mockDataset.estates.find(e => e.id === plot.estateId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        message: `I found ${matchedPlots.length} properties matching "${searchTerm}". ${matchedPlots.length > 0 ? `Top results include ${matchedPlots.slice(0, 3).map(p => `Plot ${p.number}`).join(', ')}.` : 'Try refining your search criteria.'}`,
        action: 'search',
        parameters: { query: searchTerm, results: matchedPlots },
        suggestions: ['show available plots', 'filter by price', 'filter by location']
      };
    }

    // Financial Reports
    if (lowerCommand.includes('revenue') || lowerCommand.includes('income') || lowerCommand.includes('financial') || lowerCommand.includes('money')) {
      return {
        message: `Current financial overview: Total portfolio value is ${formatCurrency(liveStats.totalRevenue)}. You have ${liveStats.allocatedPlots} income-generating plots with ${liveStats.occupancyRate}% occupancy rate. Monthly revenue target achievement is on track.`,
        action: 'show_financials',
        parameters: { totalRevenue: liveStats.totalRevenue },
        suggestions: ['payment tracking', 'profit margins', 'expense analysis']
      };
    }

    // Construction Progress
    if (lowerCommand.includes('construction') || lowerCommand.includes('progress') || lowerCommand.includes('building')) {
      return {
        message: `Construction update: You have ${liveStats.activeConstruction} active construction projects and ${liveStats.completedProjects} completed developments. All projects are progressing according to schedule with regular milestone updates.`,
        action: 'show_construction',
        parameters: { active: liveStats.activeConstruction, completed: liveStats.completedProjects },
        suggestions: ['detailed progress report', 'upcoming milestones', 'contractor performance']
      };
    }

    // Client Management
    if (lowerCommand.includes('client') || lowerCommand.includes('customer') || lowerCommand.includes('owner')) {
      const uniqueClients = [...new Set(mockDataset.plots.filter(plot => plot.ownerId).map(plot => plot.ownerId))].length;
      
      return {
        message: `Client overview: You're managing ${uniqueClients} active clients across ${liveStats.allocatedPlots} allocated plots. Recent activity shows strong engagement with multiple new inquiries this month.`,
        action: 'show_clients',
        parameters: { clientCount: uniqueClients, allocatedPlots: liveStats.allocatedPlots },
        suggestions: ['client communications', 'payment status', 'satisfaction surveys']
      };
    }

    // Default response with fallback intelligence
    return generateIntelligentResponse(command, mockDataset);
  };

  const generateIntelligentResponse = (command: string, dataset: any) => {
    const keywords = command.toLowerCase().split(' ');
    
    // Try to match keywords to actions
    if (keywords.some(word => ['estate', 'property', 'plot'].includes(word))) {
      return {
        message: `I understand you're asking about properties. You have ${dataset.estates.length} estates with ${dataset.plots.length} total plots. Would you like to see analytics, search for specific properties, or get an overview?`,
        action: 'suggest_property_actions',
        parameters: { estates: dataset.estates.length, plots: dataset.plots.length },
        suggestions: ['estate overview', 'property search', 'analytics dashboard']
      };
    }
    
    if (keywords.some(word => ['money', 'payment', 'cost', 'price'].includes(word))) {
      return {
        message: `I can help with financial information. Your portfolio value is ${formatCurrency(liveStats.totalRevenue)}. Would you like to see revenue trends, payment tracking, or cost analysis?`,
        action: 'suggest_financial_actions',
        parameters: { totalRevenue: liveStats.totalRevenue },
        suggestions: ['revenue report', 'payment status', 'financial analytics']
      };
    }
    
    return {
      message: `I'm not sure I understood that completely. I can help with estate analytics, property searches, construction progress, financial reports, and client management. Try asking "show me my statistics" or "help me find properties".`,
      action: 'suggest_help',
      parameters: {},
      suggestions: ['show statistics', 'property search', 'help guide']
    };
  };

  const extractSearchTerm = (command: string): string => {
    const words = command.toLowerCase().split(' ');
    const searchIndex = words.findIndex(word => ['find', 'search', 'look'].includes(word));
    return searchIndex !== -1 ? words.slice(searchIndex + 1).join(' ') : command;
  };

  const executeAction = (action: string, parameters?: Record<string, any>) => {
    console.log('Executing action:', action, parameters);
    
    // Add notification for demonstration
    if (user && addNotification) {
      addNotification({
        id: Date.now().toString(),
        title: 'Voice Command Executed',
        message: `Action: ${action}`,
        type: 'info',
        read: false,
        createdAt: new Date(),
        userId: user.id
      });
    }
    
    // Handle navigation actions
    if (action === 'navigate' && parameters?.route) {
      // In a real app, you would use router navigation here
      console.log('Navigating to:', parameters.route);
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speed;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    // Try to use the preferred voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(settings.language.split('-')[0]) &&
      voice.name.toLowerCase().includes(settings.voice)
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available');
      return;
    }
    
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleWakeWord = () => {
    setIsWakeWordActive(!isWakeWordActive);
    if (!isWakeWordActive && !isListening) {
      startListening();
    } else if (isWakeWordActive && isListening) {
      stopListening();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Bot className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Voice Assistant</h2>
            <p className="text-gray-600">Natural language interface for estate management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleWakeWord}
            variant={isWakeWordActive ? 'primary' : 'outline'}
            icon={<Zap className="h-4 w-4" />}
          >
            Wake Word {isWakeWordActive ? 'On' : 'Off'}
          </Button>
          
          <Button
            variant="outline"
            icon={<Settings className="h-4 w-4" />}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Live Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Estates</h3>
          <p className="text-2xl font-bold text-blue-900">{liveStats.totalEstates}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-green-900">{liveStats.occupancyRate}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Active Construction</h3>
          <p className="text-2xl font-bold text-purple-900">{liveStats.activeConstruction}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Portfolio Value</h3>
          <p className="text-2xl font-bold text-yellow-900">{formatCurrency(liveStats.totalRevenue).substring(0, 7)}...</p>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-lg">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? 'destructive' : 'primary'}
          size="lg"
          icon={isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          className={isListening ? 'animate-pulse' : ''}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        
        <Button
          onClick={isSpeaking ? stopSpeaking : () => speakText('Voice assistant is ready to help you.')}
          variant={isSpeaking ? 'destructive' : 'outline'}
          size="lg"
          icon={isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          className={isSpeaking ? 'animate-pulse' : ''}
        >
          {isSpeaking ? 'Stop Speaking' : 'Test Voice'}
        </Button>
      </div>

      {/* Live Transcript */}
      {(isListening || transcript) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Listening...</span>
            </div>
            <p className="text-gray-900">{transcript || 'Speak now...'}</p>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Conversation
              </h3>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      
                      {message.commands && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.commands.map((cmd, idx) => (
                            <button
                              key={idx}
                              onClick={() => processVoiceCommand(cmd, 1.0)}
                              className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30"
                            >
                              {cmd}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Commands */}
        <div>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Commands</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCommands.map((command) => (
                  <div key={command.id} className="p-3 border border-gray-200 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {command.command.substring(0, 30)}...
                      </span>
                      <Badge className={`text-xs ${getConfidenceColor(command.confidence)}`}>
                        {Math.round(command.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{command.response.substring(0, 50)}...</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {command.timestamp.toLocaleTimeString()}
                      </span>
                      {command.action && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          {command.action}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voice Commands Help */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Voice Commands Examples</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { category: 'Analytics', commands: ['Show estate analytics', 'Revenue trends', 'Client statistics'] },
              { category: 'Properties', commands: ['Find properties in Lekki', 'Show available plots', 'Create new property'] },
              { category: 'Clients', commands: ['Show client list', 'Contact client John', 'Schedule meeting'] },
              { category: 'Documents', commands: ['Upload document', 'Verify certificate', 'Download report'] }
            ].map((group) => (
              <div key={group.category} className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium text-gray-900 mb-2">{group.category}</h4>
                <ul className="space-y-1">
                  {group.commands.map((cmd, idx) => (
                    <li key={idx} className="text-sm text-gray-600">"<em>{cmd}</em>"</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
