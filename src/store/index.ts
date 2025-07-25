import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  User, 
  Estate, 
  Plot, 
  Document, 
  Notification, 
  Subscription,
  AppError,
  LoadingState,
  ThemeMode,
  Language 
} from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: ThemeMode;
  language: Language;
  sidebarOpen: boolean;
  loading: LoadingState;
  error: AppError | null;
  
  // Data state
  estates: Estate[];
  selectedEstate: Estate | null;
  plots: Plot[];
  documents: Document[];
  notifications: Notification[];
  subscription: Subscription | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: AppError | null) => void;
  
  // Data actions
  setEstates: (estates: Estate[]) => void;
  setSelectedEstate: (estate: Estate | null) => void;
  addEstate: (estate: Estate) => void;
  updateEstate: (id: string, updates: Partial<Estate>) => void;
  deleteEstate: (id: string) => void;
  
  setPlots: (plots: Plot[]) => void;
  addPlot: (plot: Plot) => void;
  updatePlot: (id: string, updates: Partial<Plot>) => void;
  deletePlot: (id: string) => void;
  
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  setSubscription: (subscription: Subscription | null) => void;
  
  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'light' as ThemeMode,
  language: 'en' as Language,
  sidebarOpen: false,
  loading: 'idle' as LoadingState,
  error: null,
  estates: [],
  selectedEstate: null,
  plots: [],
  documents: [],
  notifications: [],
  subscription: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // User actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        // UI actions
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        
        // Estate actions
        setEstates: (estates) => set({ estates }),
        setSelectedEstate: (selectedEstate) => set({ selectedEstate }),
        addEstate: (estate) => set((state) => ({ 
          estates: [...state.estates, estate] 
        })),
        updateEstate: (id, updates) => set((state) => ({
          estates: state.estates.map(estate => 
            estate.id === id ? { ...estate, ...updates } : estate
          )
        })),
        deleteEstate: (id) => set((state) => ({
          estates: state.estates.filter(estate => estate.id !== id),
          selectedEstate: state.selectedEstate?.id === id ? null : state.selectedEstate
        })),
        
        // Plot actions
        setPlots: (plots) => set({ plots }),
        addPlot: (plot) => set((state) => ({ 
          plots: [...state.plots, plot] 
        })),
        updatePlot: (id, updates) => set((state) => ({
          plots: state.plots.map(plot => 
            plot.id === id ? { ...plot, ...updates } : plot
          )
        })),
        deletePlot: (id) => set((state) => ({
          plots: state.plots.filter(plot => plot.id !== id)
        })),
        
        // Document actions
        setDocuments: (documents) => set({ documents }),
        addDocument: (document) => set((state) => ({ 
          documents: [...state.documents, document] 
        })),
        updateDocument: (id, updates) => set((state) => ({
          documents: state.documents.map(doc => 
            doc.id === id ? { ...doc, ...updates } : doc
          )
        })),
        deleteDocument: (id) => set((state) => ({
          documents: state.documents.filter(doc => doc.id !== id)
        })),
        
        // Notification actions
        setNotifications: (notifications) => set({ notifications }),
        addNotification: (notification) => set((state) => ({ 
          notifications: [notification, ...state.notifications] 
        })),
        markNotificationAsRead: (id) => set((state) => ({
          notifications: state.notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
          )
        })),
        clearNotifications: () => set({ notifications: [] }),
        
        // Subscription actions
        setSubscription: (subscription) => set({ subscription }),
        
        // Utility actions
        clearError: () => set({ error: null }),
        reset: () => set(initialState),
      }),
      {
        name: 'estate-tracker-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'EstateTracker Store',
    }
  )
);

// Selectors
export const useAuth = () => {
  const { user, isAuthenticated, setUser } = useAppStore();
  return { user, isAuthenticated, setUser };
};

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();
  return { theme, setTheme };
};

export const useNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    markNotificationAsRead, 
    clearNotifications 
  } = useAppStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return { 
    notifications, 
    unreadCount,
    addNotification, 
    markNotificationAsRead, 
    clearNotifications 
  };
};

export const useEstates = () => {
  const { 
    estates, 
    selectedEstate, 
    setEstates, 
    setSelectedEstate, 
    addEstate, 
    updateEstate, 
    deleteEstate 
  } = useAppStore();
  
  return { 
    estates, 
    selectedEstate, 
    setEstates, 
    setSelectedEstate, 
    addEstate, 
    updateEstate, 
    deleteEstate 
  };
};

export const usePlots = () => {
  const { 
    plots, 
    setPlots, 
    addPlot, 
    updatePlot, 
    deletePlot 
  } = useAppStore();
  
  return { 
    plots, 
    setPlots, 
    addPlot, 
    updatePlot, 
    deletePlot 
  };
};

export const useDocuments = () => {
  const { 
    documents, 
    setDocuments, 
    addDocument, 
    updateDocument, 
    deleteDocument 
  } = useAppStore();
  
  return { 
    documents, 
    setDocuments, 
    addDocument, 
    updateDocument, 
    deleteDocument 
  };
};
