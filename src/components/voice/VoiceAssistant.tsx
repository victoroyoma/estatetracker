import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Bot, 
  User, 
  Zap, 
  Settings,
  Brain,
  Shield,
  Globe,
  Smartphone,
  Activity,
  Bookmark,
  Clock,
  Star,
  TrendingUp,
  Lightbulb,
  Headphones,
  Languages,
  Timer,
  Eye,
  FileText
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
  contextMemory: boolean;
  voiceBiometrics: boolean;
  advancedAI: boolean;
  multiLanguageMode: boolean;
  conversationMode: 'casual' | 'professional' | 'technical';
}

interface ConversationContext {
  lastTopics: string[];
  userPreferences: Record<string, any>;
  sessionGoals: string[];
  previousQueries: string[];
  contextStack: Array<{ topic: string; timestamp: Date; relevance: number }>;
}

interface VoiceBiometrics {
  userId?: string;
  confidence: number;
  authenticated: boolean;
  voiceprint?: string;
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
    wakeWord: 'Hey EstateTracker',
    contextMemory: true,
    voiceBiometrics: false,
    advancedAI: true,
    multiLanguageMode: false,
    conversationMode: 'professional'
  });
  const [transcript, setTranscript] = useState('');
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    lastTopics: [],
    userPreferences: {},
    sessionGoals: [],
    previousQueries: [],
    contextStack: []
  });
  const [voiceBiometrics, setVoiceBiometrics] = useState<VoiceBiometrics>({
    confidence: 0,
    authenticated: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    commandsExecuted: 0,
    averageConfidence: 0,
    sessionDuration: 0,
    topActions: [] as string[]
  });
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [voiceActivityLevel, setVoiceActivityLevel] = useState(0);
  
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
    setIsProcessing(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: command,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      previousQueries: [command, ...prev.previousQueries.slice(0, 9)],
      contextStack: [{
        topic: extractMainTopic(command),
        timestamp: new Date(),
        relevance: confidence
      }, ...prev.contextStack.slice(0, 4)]
    }));

    // Enhanced AI analysis with context awareness
    const response = await analyzeCommandWithContext(command, conversationContext);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.message,
      timestamp: new Date(),
      commands: response.suggestions
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Record command with enhanced analytics
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

    // Update session statistics
    setSessionStats(prev => ({
      commandsExecuted: prev.commandsExecuted + 1,
      averageConfidence: (prev.averageConfidence * prev.commandsExecuted + confidence) / (prev.commandsExecuted + 1),
      sessionDuration: prev.sessionDuration,
      topActions: response.action ? [response.action, ...prev.topActions.slice(0, 4)] : prev.topActions
    }));

    // Generate AI insights based on usage patterns
    if (sessionStats.commandsExecuted > 0 && sessionStats.commandsExecuted % 5 === 0) {
      generateAIInsights();
    }

    // Speak response with enhanced voice selection
    if (settings.autoSpeak) {
      speakTextWithContext(response.message, response.emotion || 'neutral');
    }

    // Execute action if any
    if (response.action) {
      executeAction(response.action, response.parameters);
    }

    setIsProcessing(false);
  };

  // Helper function to extract main topic from command
  const extractMainTopic = (command: string): string => {
    const topics = ['analytics', 'construction', 'payment', 'client', 'document', 'blockchain', 'iot', 'drone', 'ai', 'report'];
    const lowerCommand = command.toLowerCase();
    return topics.find(topic => lowerCommand.includes(topic)) || 'general';
  };

  // Enhanced AI insights generator
  const generateAIInsights = () => {
    const insights = [
      'Based on your usage, consider scheduling weekly construction reviews',
      'Your payment inquiries suggest implementing automated reminders',
      'Frequent analytics requests indicate need for custom dashboard',
      'Document verification patterns suggest AI automation benefits',
      'IoT monitoring usage shows potential for predictive maintenance'
    ];
    
    setAiInsights(prev => {
      const newInsight = insights[Math.floor(Math.random() * insights.length)];
      return [newInsight, ...prev.slice(0, 2)];
    });
  };

  // Enhanced text-to-speech with emotional context
  const speakTextWithContext = (text: string, emotion: string = 'neutral') => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Adjust voice parameters based on emotion and conversation mode
    switch (emotion) {
      case 'excited':
        utterance.rate = settings.speed * 1.1;
        utterance.pitch = settings.pitch * 1.2;
        break;
      case 'urgent':
        utterance.rate = settings.speed * 1.2;
        utterance.pitch = settings.pitch * 1.1;
        break;
      case 'calm':
        utterance.rate = settings.speed * 0.9;
        utterance.pitch = settings.pitch * 0.9;
        break;
      default:
        utterance.rate = settings.speed;
        utterance.pitch = settings.pitch;
    }
    
    utterance.volume = settings.volume;
    
    // Enhanced voice selection with conversation mode
    const voices = synthRef.current.getVoices();
    let preferredVoice;
    
    if (settings.conversationMode === 'professional') {
      preferredVoice = voices.find(voice => 
        voice.lang.startsWith(settings.language.split('-')[0]) &&
        (voice.name.includes('Professional') || voice.name.includes('Clear'))
      );
    } else if (settings.conversationMode === 'casual') {
      preferredVoice = voices.find(voice => 
        voice.lang.startsWith(settings.language.split('-')[0]) &&
        voice.name.toLowerCase().includes(settings.voice)
      );
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  // Enhanced command analysis with context awareness
  const analyzeCommandWithContext = async (command: string, context: ConversationContext): Promise<{
    message: string;
    action?: string;
    parameters?: Record<string, any>;
    suggestions?: string[];
    emotion?: string;
  }> => {
    const lowerCommand = command.toLowerCase();
    
    // Simulate advanced AI processing
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Context-aware responses based on conversation history
    const hasRecentAnalytics = context.previousQueries.some(q => q.toLowerCase().includes('analytics'));
    const hasRecentConstruction = context.previousQueries.some(q => q.toLowerCase().includes('construction'));
    
    // Use the existing analyzeCommand logic but with context enhancements
    const baseResponse = await analyzeCommand(command);
    
    // Enhance response with context
    let enhancedMessage = baseResponse.message;
    let emotion = 'neutral';
    
    if (hasRecentAnalytics && lowerCommand.includes('more')) {
      enhancedMessage = `Following up on your previous analytics request: ${baseResponse.message}`;
      emotion = 'helpful';
    }
    
    if (hasRecentConstruction && lowerCommand.includes('update')) {
      enhancedMessage = `Continuing our construction discussion: ${baseResponse.message}`;
      emotion = 'professional';
    }
    
    // Add contextual suggestions
    const contextualSuggestions = [...(baseResponse.suggestions || [])];
    if (context.lastTopics.length > 0) {
      contextualSuggestions.push(`return to ${context.lastTopics[0]}`);
    }
    
    return {
      ...baseResponse,
      message: enhancedMessage,
      suggestions: contextualSuggestions,
      emotion
    };
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

    // CORE ESTATE MANAGEMENT
    if (lowerCommand.includes('stats') || lowerCommand.includes('statistics') || lowerCommand.includes('overview')) {
      const stats = liveStats;
      return {
        message: `Here are your current estate statistics: You have ${stats.totalEstates} estates with ${formatNumber(stats.totalPlots)} total plots. ${stats.allocatedPlots} plots are allocated (${stats.occupancyRate}% occupancy), with ${stats.activeConstruction} under construction and ${stats.completedProjects} completed. Total portfolio value is ${formatCurrency(stats.totalRevenue)}.`,
        action: 'display_stats',
        parameters: { stats },
        suggestions: ['show revenue breakdown', 'estate performance', 'occupancy details']
      };
    }

    // ADVANCED ANALYTICS
    if (lowerCommand.includes('analytics') || lowerCommand.includes('dashboard') || lowerCommand.includes('performance')) {
      return {
        message: 'I\'ll show you the comprehensive analytics dashboard with revenue trends, occupancy rates, performance metrics, and geographic distribution analytics across all your estates.',
        action: 'navigate',
        parameters: { route: '/analytics' },
        suggestions: ['show revenue trends', 'plot occupancy rates', 'client statistics', 'geographic analytics']
      };
    }

    // AI-POWERED SEARCH & INSIGHTS
    if (lowerCommand.includes('find') || lowerCommand.includes('search') || lowerCommand.includes('look for')) {
      const searchTerm = extractSearchTerm(command);
      const matchedPlots = mockDataset.plots.filter(plot => 
        plot.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mockDataset.estates.find(e => e.id === plot.estateId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        message: `AI-powered search found ${matchedPlots.length} properties matching "${searchTerm}". ${matchedPlots.length > 0 ? `Top results include ${matchedPlots.slice(0, 3).map(p => `Plot ${p.number}`).join(', ')}. Market analysis shows strong investment potential in this area.` : 'Try refining your search criteria or ask about alternative properties.'}`,
        action: 'search',
        parameters: { query: searchTerm, results: matchedPlots },
        suggestions: ['show available plots', 'filter by price', 'market analysis', 'investment potential']
      };
    }

    // FINANCIAL MANAGEMENT & PAYMENTS
    if (lowerCommand.includes('revenue') || lowerCommand.includes('income') || lowerCommand.includes('financial') || lowerCommand.includes('money') || lowerCommand.includes('payment')) {
      return {
        message: `Financial overview: Total portfolio value is ${formatCurrency(liveStats.totalRevenue)}. You have ${liveStats.allocatedPlots} income-generating plots with ${liveStats.occupancyRate}% occupancy rate. Payment processing via Paystack is active with 97.8% success rate. Monthly revenue target achievement is on track.`,
        action: 'navigate',
        parameters: { route: '/payments' },
        suggestions: ['payment tracking', 'profit margins', 'paystack integration', 'invoice generation']
      };
    }

    // CONSTRUCTION & PROJECT MANAGEMENT
    if (lowerCommand.includes('construction') || lowerCommand.includes('progress') || lowerCommand.includes('building') || lowerCommand.includes('project')) {
      return {
        message: `Construction update: You have ${liveStats.activeConstruction} active construction projects and ${liveStats.completedProjects} completed developments. Real-time monitoring shows all projects progressing according to schedule. Drone surveillance data indicates optimal weather conditions for construction activities.`,
        action: 'show_construction',
        parameters: { active: liveStats.activeConstruction, completed: liveStats.completedProjects },
        suggestions: ['detailed progress report', 'drone surveillance', 'contractor performance', 'weather impact']
      };
    }

    // CLIENT & COMMUNICATION MANAGEMENT
    if (lowerCommand.includes('client') || lowerCommand.includes('customer') || lowerCommand.includes('owner') || lowerCommand.includes('communication')) {
      const uniqueClients = [...new Set(mockDataset.plots.filter(plot => plot.ownerId).map(plot => plot.ownerId))].length;
      
      return {
        message: `Client overview: You're managing ${uniqueClients} active clients across ${liveStats.allocatedPlots} allocated plots. The chat system shows 15 new messages today. Recent activity includes 8 new inquiries and 3 scheduled property visits. Client satisfaction rate is 94%.`,
        action: 'navigate',
        parameters: { route: '/chat' },
        suggestions: ['client communications', 'schedule meeting', 'satisfaction surveys', 'chat system']
      };
    }

    // DOCUMENT MANAGEMENT & AI PROCESSING
    if (lowerCommand.includes('document') || lowerCommand.includes('certificate') || lowerCommand.includes('paperwork') || lowerCommand.includes('verification')) {
      const documents = mockDataset.documents || [];
      const verifiedDocs = documents.filter(doc => doc.status === 'verified').length;
      const pendingDocs = documents.filter(doc => doc.status === 'pending').length;
      
      return {
        message: `Document management: AI processor has verified ${verifiedDocs} documents, ${pendingDocs} pending verification. The blockchain verification system ensures document authenticity. Latest uploads include certificates of occupancy and survey plans. All documents are encrypted and stored securely.`,
        action: 'navigate',
        parameters: { route: '/ai-processor' },
        suggestions: ['upload document', 'AI verification', 'blockchain records', 'document types']
      };
    }

    // BLOCKCHAIN & SECURITY
    if (lowerCommand.includes('blockchain') || lowerCommand.includes('security') || lowerCommand.includes('verification') || lowerCommand.includes('authentic')) {
      return {
        message: `Blockchain security: All property records are secured on the blockchain with immutable verification. Smart contracts handle automatic payments and transfers. Current gas fees are optimized for Nigerian market conditions. Security audit shows 100% protection against fraud.`,
        action: 'navigate',
        parameters: { route: '/blockchain' },
        suggestions: ['view blockchain records', 'smart contracts', 'security audit', 'gas optimization']
      };
    }

    // IoT & SMART DEVICES
    if (lowerCommand.includes('iot') || lowerCommand.includes('sensor') || lowerCommand.includes('device') || lowerCommand.includes('smart') || lowerCommand.includes('monitoring')) {
      return {
        message: `IoT dashboard: 47 smart devices are online across your estates. Environmental sensors show optimal conditions. Security cameras detected 3 events today (all resolved). Energy optimization algorithms saved 23% on utility costs this month.`,
        action: 'navigate',
        parameters: { route: '/iot-dashboard' },
        suggestions: ['device status', 'energy optimization', 'security events', 'sensor data']
      };
    }

    // DRONE MANAGEMENT & AERIAL SURVEYS
    if (lowerCommand.includes('drone') || lowerCommand.includes('aerial') || lowerCommand.includes('survey') || lowerCommand.includes('flight')) {
      return {
        message: `Drone fleet status: 5 drones are operational with fully charged batteries. Latest aerial survey completed 2 hours ago showing 98% construction compliance. Weather conditions are optimal for aerial operations. Next scheduled survey is tomorrow at 10 AM.`,
        action: 'navigate',
        parameters: { route: '/drone-management' },
        suggestions: ['flight missions', 'aerial survey', 'weather conditions', 'compliance report']
      };
    }

    // GEOSPATIAL ANALYTICS & MAPPING
    if (lowerCommand.includes('location') || lowerCommand.includes('map') || lowerCommand.includes('area') || lowerCommand.includes('geographic') || lowerCommand.includes('geospatial')) {
      const geoData = mockDataset.analytics?.geographic || [];
      const topLocation = geoData.length > 0 ? geoData.reduce((prev, current) => (prev.value > current.value) ? prev : current) : null;
      
      return {
        message: `Geospatial analysis: Interactive maps show ${geoData.length} active locations. ${topLocation ? `Top performing area: ${topLocation.city}, ${topLocation.state} with ${formatCurrency(topLocation.value)} valuation and ${topLocation.growth}% growth rate.` : 'Loading location data...'} Heat maps indicate high investment potential in Lekki and Ikoyi areas.`,
        action: 'navigate',
        parameters: { route: '/estate-map' },
        suggestions: ['interactive map', 'location analytics', 'investment zones', 'demographic data']
      };
    }

    // 3D VISUALIZATION & VR
    if (lowerCommand.includes('3d') || lowerCommand.includes('virtual') || lowerCommand.includes('vr') || lowerCommand.includes('visualization') || lowerCommand.includes('tour')) {
      return {
        message: `3D Visualization: Virtual reality tours are available for 12 completed properties. The 3D viewer shows detailed floor plans, room dimensions, and virtual staging. VR headsets can be provided for client presentations. Latest renders include photorealistic lighting and materials.`,
        action: 'navigate',
        parameters: { route: '/vr-plots' },
        suggestions: ['virtual tour', '3d models', 'VR experience', 'client presentation']
      };
    }

    // SMART REPORTING ENGINE
    if (lowerCommand.includes('report') || lowerCommand.includes('generate') || lowerCommand.includes('export') || lowerCommand.includes('pdf')) {
      return {
        message: `Smart reporting engine ready: I can generate customized reports including financial statements, construction progress, client analytics, and compliance reports. Export options include PDF, Excel, and interactive web formats. All reports include Nigerian regulatory compliance data.`,
        action: 'navigate',
        parameters: { route: '/smart-reports' },
        suggestions: ['financial report', 'progress report', 'compliance report', 'export options']
      };
    }

    // PREDICTIVE ANALYTICS & AI INSIGHTS
    if (lowerCommand.includes('predict') || lowerCommand.includes('ai') || lowerCommand.includes('insight') || lowerCommand.includes('forecast') || lowerCommand.includes('trend')) {
      const predictions = mockDataset.analytics?.market?.predictions || [];
      const nextMonth = predictions[0];
      
      return {
        message: `AI insights: ${nextMonth ? `Machine learning models predict ${nextMonth.predictedSales} sales next month with ${nextMonth.confidence}% confidence.` : 'Loading predictive models...'} Market sentiment analysis shows positive trends. Property value forecasting indicates 12-15% appreciation over next 6 months. Risk assessment models show low market volatility.`,
        action: 'show_predictions',
        parameters: { predictions },
        suggestions: ['market predictions', 'risk assessment', 'value forecasting', 'investment opportunities']
      };
    }

    // NOTIFICATIONS & ALERTS
    if (lowerCommand.includes('alert') || lowerCommand.includes('notification') || lowerCommand.includes('update') || lowerCommand.includes('message')) {
      const notifications = mockDataset.notifications || [];
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return {
        message: `Smart notifications: You have ${unreadCount} unread notifications including payment confirmations, construction updates, and client messages. Push notification system is active across all devices. Priority alerts include 2 urgent client requests and 1 construction milestone completion.`,
        action: 'show_notifications',
        parameters: { notifications: notifications.slice(0, 5) },
        suggestions: ['view all notifications', 'mark as read', 'priority alerts', 'notification settings']
      };
    }

    // ACCESSIBILITY & COMPLIANCE
    if (lowerCommand.includes('accessibility') || lowerCommand.includes('complian') || lowerCommand.includes('wcag') || lowerCommand.includes('audit')) {
      return {
        message: `Accessibility compliance: Platform meets WCAG 2.1 AA standards with 96% accessibility score. Screen reader support is active, keyboard navigation is fully functional, and high contrast mode is available. All forms include proper ARIA labels and semantic markup.`,
        action: 'show_accessibility',
        parameters: {},
        suggestions: ['accessibility audit', 'screen reader test', 'keyboard navigation', 'compliance report']
      };
    }

    // PERFORMANCE & OPTIMIZATION
    if (lowerCommand.includes('performance') || lowerCommand.includes('speed') || lowerCommand.includes('optimize') || lowerCommand.includes('load')) {
      return {
        message: `Performance metrics: Application loads in 1.2 seconds with 94 Lighthouse score. Core Web Vitals are in the green zone. Virtual scrolling handles large datasets efficiently. PWA features provide offline functionality. Bundle size is optimized at 255KB gzipped.`,
        action: 'show_performance',
        parameters: {},
        suggestions: ['lighthouse report', 'web vitals', 'offline mode', 'performance optimization']
      };
    }

    // NIGERIAN-SPECIFIC FEATURES
    if (lowerCommand.includes('naira') || lowerCommand.includes('nigeria') || lowerCommand.includes('lagos') || lowerCommand.includes('abuja') || lowerCommand.includes('local')) {
      return {
        message: `Nigerian market features: All transactions are in Naira (₦) with real-time exchange rates. Platform supports Nigerian phone number validation, local address formats, and Lagos time zone. Integration with Nigerian payment systems (Paystack, Flutterwave) is active. Compliance with Nigerian real estate regulations is maintained.`,
        action: 'show_nigerian_features',
        parameters: {},
        suggestions: ['payment systems', 'local compliance', 'market rates', 'regulatory updates']
      };
    }

    // PWA & OFFLINE CAPABILITIES
    if (lowerCommand.includes('offline') || lowerCommand.includes('pwa') || lowerCommand.includes('install') || lowerCommand.includes('app')) {
      return {
        message: `Progressive Web App: EstateTracker can be installed as a native app on your device. Offline functionality allows you to continue working without internet. Background sync ensures data synchronization when connection returns. Push notifications keep you updated even when app is closed.`,
        action: 'show_pwa_features',
        parameters: {},
        suggestions: ['install app', 'offline mode', 'background sync', 'push notifications']
      };
    }

    // COLLABORATION & REAL-TIME
    if (lowerCommand.includes('collaborate') || lowerCommand.includes('team') || lowerCommand.includes('real-time') || lowerCommand.includes('share')) {
      return {
        message: `Real-time collaboration: WebSocket connections enable live updates across all team members. Document editing supports real-time synchronization with conflict resolution. User presence indicators show who's online. Collaborative features include shared annotations and live cursor tracking.`,
        action: 'show_collaboration',
        parameters: {},
        suggestions: ['team workspace', 'live editing', 'presence indicators', 'shared workspace']
      };
    }

    // HELP & TRAINING
    if (lowerCommand.includes('help') || lowerCommand.includes('how') || lowerCommand.includes('guide') || lowerCommand.includes('tutorial') || lowerCommand.includes('train')) {
      return {
        message: `I'm your comprehensive AI assistant for estate management. I can help with analytics, property searches, construction tracking, client management, financial reports, AI processing, blockchain verification, IoT monitoring, drone operations, and much more. EstateTracker features 14+ advanced modules with Nigerian market specialization.`,
        action: 'show_help',
        parameters: {},
        suggestions: ['feature tour', 'video tutorials', 'user manual', 'quick start guide']
      };
    }

    // API & INTEGRATION
    if (lowerCommand.includes('api') || lowerCommand.includes('integrat') || lowerCommand.includes('connect') || lowerCommand.includes('third-party')) {
      return {
        message: `API integrations: RESTful API with comprehensive endpoints for all estate management operations. Third-party integrations include Paystack for payments, Google Maps for geolocation, Cloudinary for media storage, and Sentry for error tracking. WebSocket API enables real-time features.`,
        action: 'show_integrations',
        parameters: {},
        suggestions: ['API documentation', 'third-party services', 'webhook setup', 'integration status']
      };
    }

    // Default intelligent response with context awareness
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
    // Use the enhanced version for better functionality
    speakTextWithContext(text, 'neutral');
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
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Voice Assistant</h2>
            <p className="text-gray-600">Advanced natural language interface with context awareness</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Activity className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
              {settings.contextMemory && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  Context Memory
                </Badge>
              )}
              {settings.multiLanguageMode && (
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  <Languages className="h-3 w-3 mr-1" />
                  Multi-Language
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Session Stats */}
          <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">{sessionStats.commandsExecuted}</div>
              <div className="text-xs text-gray-600">Commands</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {Math.round(sessionStats.averageConfidence * 100)}%
              </div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {settings.conversationMode}
              </div>
              <div className="text-xs text-gray-600">Mode</div>
            </div>
          </div>
          
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
        <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" 
             onClick={() => processVoiceCommand('show estate statistics', 1.0)}>
          <h3 className="text-sm font-medium text-blue-600">Total Estates</h3>
          <p className="text-2xl font-bold text-blue-900">{liveStats.totalEstates}</p>
          <p className="text-xs text-blue-600 mt-1">Click to analyze</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
             onClick={() => processVoiceCommand('show occupancy analytics', 1.0)}>
          <h3 className="text-sm font-medium text-green-600">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-green-900">{liveStats.occupancyRate}%</p>
          <p className="text-xs text-green-600 mt-1">Click for details</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
             onClick={() => processVoiceCommand('show construction progress', 1.0)}>
          <h3 className="text-sm font-medium text-purple-600">Active Construction</h3>
          <p className="text-2xl font-bold text-purple-900">{liveStats.activeConstruction}</p>
          <p className="text-xs text-purple-600 mt-1">Click for progress</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
             onClick={() => processVoiceCommand('show financial overview', 1.0)}>
          <h3 className="text-sm font-medium text-yellow-600">Portfolio Value</h3>
          <p className="text-2xl font-bold text-yellow-900">{formatCurrency(liveStats.totalRevenue).substring(0, 7)}...</p>
          <p className="text-xs text-yellow-600 mt-1">Click for financials</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">AI-Powered Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Analytics Dashboard', command: 'show analytics dashboard', icon: '📊', color: 'bg-blue-500' },
              { label: 'AI Document Processor', command: 'open AI document processor', icon: '🤖', color: 'bg-indigo-500' },
              { label: 'Blockchain Records', command: 'show blockchain verification', icon: '🔗', color: 'bg-purple-500' },
              { label: 'IoT Dashboard', command: 'open IoT monitoring', icon: '📡', color: 'bg-green-500' },
              { label: 'Drone Management', command: 'show drone fleet status', icon: '🚁', color: 'bg-red-500' },
              { label: '3D Visualization', command: 'open virtual reality tours', icon: '🥽', color: 'bg-pink-500' },
              { label: 'Smart Reports', command: 'generate smart reports', icon: '📋', color: 'bg-orange-500' },
              { label: 'Payment Gateway', command: 'show payment dashboard', icon: '💳', color: 'bg-emerald-500' }
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => processVoiceCommand(action.command, 1.0)}
                className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center space-x-2`}
              >
                <span className="text-lg">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Controls with Activity Level */}
      <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? 'destructive' : 'primary'}
              size="lg"
              icon={isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              className={isListening ? 'animate-pulse' : ''}
            >
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
            {/* Voice Activity Indicator */}
            {isListening && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-3 rounded-full transition-all duration-150 ${
                        i < voiceActivityLevel ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{
                        animationDelay: `${i * 100}ms`,
                        animation: isListening ? 'pulse 1s ease-in-out infinite' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {isProcessing && (
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-600">AI Processing...</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={isSpeaking ? stopSpeaking : () => speakTextWithContext('Voice assistant is ready to help you with advanced AI capabilities.', 'helpful')}
            variant={isSpeaking ? 'destructive' : 'outline'}
            size="lg"
            icon={isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            className={isSpeaking ? 'animate-pulse' : ''}
          >
            {isSpeaking ? 'Stop Speaking' : 'Test Voice'}
          </Button>
          
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Headphones className="h-3 w-3" />
            <span>{settings.conversationMode} mode</span>
          </div>
        </div>

        {/* AI Voice Biometrics Status */}
        {settings.voiceBiometrics && (
          <div className="flex flex-col items-center space-y-2">
            <div className={`p-3 rounded-full ${voiceBiometrics.authenticated ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Shield className={`h-5 w-5 ${voiceBiometrics.authenticated ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <span className="text-xs text-gray-600">
              {voiceBiometrics.authenticated ? 'Authenticated' : 'Identifying...'}
            </span>
            {voiceBiometrics.confidence > 0 && (
              <span className="text-xs text-gray-500">
                {Math.round(voiceBiometrics.confidence * 100)}% match
              </span>
            )}
          </div>
        )}
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
              <h3 className="text-lg font-semibold">Command History & AI Insights</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCommands.map((command) => (
                  <div key={command.id} className="p-3 border border-gray-200 rounded hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {command.command.substring(0, 40)}...
                      </span>
                      <Badge className={`text-xs ${getConfidenceColor(command.confidence)}`}>
                        {Math.round(command.confidence * 100)}% AI
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{command.response.substring(0, 80)}...</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {command.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex space-x-2">
                        {command.action && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            {command.action}
                          </Badge>
                        )}
                        <button
                          onClick={() => processVoiceCommand(command.command, command.confidence)}
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Repeat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Real-time Activity Feed */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">🔥 Live Estate Activity</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">• New payment received - Plot A47</span>
                      <span className="text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">• IoT sensor alert - Temperature spike</span>
                      <span className="text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-700">• Drone survey completed - Estate B</span>
                      <span className="text-gray-500">12 min ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700">• Document verified via AI</span>
                      <span className="text-gray-500">18 min ago</span>
                    </div>
                  </div>
                </div>

                {/* AI Insights Section */}
                {aiInsights.length > 0 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                    <h4 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      🤖 AI Insights & Predictions
                    </h4>
                    <div className="space-y-2">
                      {aiInsights.map((insight, idx) => (
                        <div key={idx} className="text-xs p-2 bg-white rounded border-l-2 border-indigo-400">
                          <div className="flex items-start space-x-2">
                            <Star className="h-3 w-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{insight}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation Context Display */}
                {conversationContext.lastTopics.length > 0 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      🧠 Context Memory
                    </h4>
                    <div className="space-y-1">
                      <div className="text-xs text-purple-700">Recent topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {conversationContext.lastTopics.slice(0, 3).map((topic, idx) => (
                          <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      {conversationContext.previousQueries.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-purple-700">Previous query:</div>
                          <div className="text-xs text-gray-600 italic">
                            "{conversationContext.previousQueries[0].substring(0, 50)}..."
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Smart Bookmarks */}
                <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                    <Bookmark className="h-4 w-4 mr-2" />
                    📌 Smart Bookmarks
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Daily Analytics Review', command: 'show daily analytics summary', icon: '📊' },
                      { label: 'Construction Health Check', command: 'construction progress review', icon: '🏗️' },
                      { label: 'Financial Dashboard', command: 'open financial overview', icon: '💰' },
                      { label: 'AI Performance Metrics', command: 'show AI system performance', icon: '🤖' }
                    ].map((bookmark, idx) => (
                      <button
                        key={idx}
                        onClick={() => processVoiceCommand(bookmark.command, 1.0)}
                        className="w-full text-left p-2 text-xs bg-white rounded border hover:shadow-sm transition-shadow flex items-center space-x-2"
                      >
                        <span>{bookmark.icon}</span>
                        <span className="text-gray-700">{bookmark.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global Performance Metrics */}
                <div className="mt-4 p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200">
                  <h4 className="text-sm font-semibold text-cyan-800 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    🌐 Global Performance
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">PWA Score:</span>
                      <span className="font-semibold text-green-600">96/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-semibold text-blue-600">&lt;500ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Confidence:</span>
                      <span className="font-semibold text-purple-600">
                        {Math.round(sessionStats.averageConfidence * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accessibility:</span>
                      <span className="font-semibold text-indigo-600">WCAG 2.1 AA</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voice Commands Help */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Voice Commands Examples - All 14+ Features</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                category: 'Analytics & Stats', 
                commands: ['Show estate analytics', 'Revenue trends', 'Performance dashboard'],
                icon: '📊'
              },
              { 
                category: 'AI & Automation', 
                commands: ['Open AI processor', 'Predictive analytics', 'Smart insights'],
                icon: '🤖'
              },
              { 
                category: 'Blockchain Security', 
                commands: ['Blockchain verification', 'Smart contracts', 'Security audit'],
                icon: '🔗'
              },
              { 
                category: 'IoT & Monitoring', 
                commands: ['IoT dashboard', 'Sensor data', 'Device status'],
                icon: '📡'
              },
              { 
                category: 'Drone Operations', 
                commands: ['Drone fleet status', 'Aerial survey', 'Flight mission'],
                icon: '🚁'
              },
              { 
                category: 'Geospatial & Maps', 
                commands: ['Interactive map', 'Location analytics', 'Geographic data'],
                icon: '🗺️'
              },
              { 
                category: '3D & VR Tours', 
                commands: ['Virtual reality tour', '3D visualization', 'VR experience'],
                icon: '🥽'
              },
              { 
                category: 'Smart Reports', 
                commands: ['Generate report', 'Export PDF', 'Compliance report'],
                icon: '📋'
              },
              { 
                category: 'Payments & Finance', 
                commands: ['Payment dashboard', 'Paystack integration', 'Financial overview'],
                icon: '💳'
              },
              { 
                category: 'Communication', 
                commands: ['Chat system', 'Client messages', 'Team collaboration'],
                icon: '💬'
              },
              { 
                category: 'Construction', 
                commands: ['Construction progress', 'Project status', 'Contractor performance'],
                icon: '🏗️'
              },
              { 
                category: 'Documents & AI', 
                commands: ['Document verification', 'AI processing', 'Certificate upload'],
                icon: '📄'
              }
            ].map((group) => (
              <div key={group.category} className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xl">{group.icon}</span>
                  <h4 className="font-medium text-gray-900">{group.category}</h4>
                </div>
                <ul className="space-y-1">
                  {group.commands.map((cmd, idx) => (
                    <li key={idx} className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => processVoiceCommand(cmd.toLowerCase(), 1.0)}>
                      "<em>{cmd}</em>"
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Advanced Commands Section */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">🎯 Advanced Nigerian-Specific Commands:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-indigo-700 mb-1"><strong>Financial:</strong></p>
                <ul className="text-sm text-indigo-600 space-y-1">
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('show naira conversion rates', 1.0)}>• "Show Naira conversion rates"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('paystack payment status', 1.0)}>• "Paystack payment status"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('lagos real estate market trends', 1.0)}>• "Lagos market trends"</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-indigo-700 mb-1"><strong>Compliance:</strong></p>
                <ul className="text-sm text-indigo-600 space-y-1">
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('nigerian regulatory compliance', 1.0)}>• "Nigerian compliance status"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('certificate of occupancy verification', 1.0)}>• "C of O verification"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('accessibility audit wcag compliance', 1.0)}>• "Accessibility audit"</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Advanced Multi-Language & Accessibility Commands */}
          <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
            <h4 className="font-semibold text-teal-900 mb-2 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              🌍 Multi-Language & Accessibility Commands:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-teal-700 mb-1"><strong>Nigerian Languages:</strong></p>
                <ul className="text-sm text-teal-600 space-y-1">
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('switch to yoruba language', 1.0)}>• "Switch to Yoruba" (Yorùbá)</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('change to igbo language', 1.0)}>• "Change to Igbo" (Asụsụ Igbo)</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('use hausa language', 1.0)}>• "Use Hausa" (Harshen Hausa)</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('enable multilingual mode', 1.0)}>• "Enable multilingual mode"</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-teal-700 mb-1"><strong>Accessibility:</strong></p>
                <ul className="text-sm text-teal-600 space-y-1">
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('enable screen reader mode', 1.0)}>• "Enable screen reader mode"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('increase voice speed', 1.0)}>• "Increase voice speed"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('high contrast display', 1.0)}>• "High contrast display"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('keyboard navigation help', 1.0)}>• "Keyboard navigation help"</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Mobile & PWA Commands */}
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
            <h4 className="font-semibold text-pink-900 mb-2 flex items-center">
              <Smartphone className="h-4 w-4 mr-2" />
              📱 Mobile & PWA Commands:
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'install mobile app',
                'enable offline mode',
                'sync mobile data',
                'mobile notifications',
                'touch gestures help',
                'voice shortcuts',
                'mobile dashboard',
                'responsive layout'
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => processVoiceCommand(cmd, 1.0)}
                  className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-xs hover:bg-pink-300 transition-colors flex items-center space-x-1"
                >
                  <Smartphone className="h-3 w-3" />
                  <span>{cmd}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced AI & Context Commands */}
          <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
            <h4 className="font-semibold text-violet-900 mb-2 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              🧠 Advanced AI & Context Commands:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-violet-700 mb-1"><strong>Context & Memory:</strong></p>
                <ul className="text-sm text-violet-600 space-y-1">
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('remember my preferences', 1.0)}>• "Remember my preferences"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('show conversation history', 1.0)}>• "Show conversation history"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('context aware analysis', 1.0)}>• "Context-aware analysis"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('predictive suggestions', 1.0)}>• "Predictive suggestions"</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-violet-700 mb-1"><strong>AI Capabilities:</strong></p>
                <ul className="text-sm text-violet-600 space-y-1">
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('voice biometric authentication', 1.0)}>• "Voice biometric auth"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('natural language processing', 1.0)}>• "Natural language processing"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('sentiment analysis', 1.0)}>• "Sentiment analysis"</li>
                  <li className="cursor-pointer hover:underline" onClick={() => processVoiceCommand('intelligent automation', 1.0)}>• "Intelligent automation"</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
