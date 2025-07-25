/**
 * Comprehensive mock data and demo functions for EstateTracker
 * This provides realistic data to make the app feel alive and interactive
 */

import { User, Estate, Plot, Document, Notification, ConstructionStage } from '../types';

// Nigerian states and major cities for realistic location data
export const nigerianLocations = [
  { state: 'Lagos', city: 'Victoria Island', coordinates: [6.4281, 3.4219] },
  { state: 'Lagos', city: 'Lekki', coordinates: [6.4698, 3.5852] },
  { state: 'Lagos', city: 'Ikoyi', coordinates: [6.4580, 3.4348] },
  { state: 'Lagos', city: 'Ajah', coordinates: [6.4698, 3.6010] },
  { state: 'Abuja', city: 'Maitama', coordinates: [9.0579, 7.4951] },
  { state: 'Abuja', city: 'Asokoro', coordinates: [9.0317, 7.5248] },
  { state: 'Abuja', city: 'Wuse II', coordinates: [9.0579, 7.4879] },
  { state: 'Rivers', city: 'GRA Phase 1', coordinates: [4.8156, 7.0498] },
  { state: 'Rivers', city: 'Old GRA', coordinates: [4.8156, 7.0390] },
  { state: 'Ogun', city: 'Ibafo', coordinates: [6.5533, 3.3881] },
  { state: 'Ogun', city: 'Mowe', coordinates: [6.7833, 3.4333] },
];

// Nigerian names for realistic user data
export const nigerianNames = {
  male: [
    'Adebayo Ogundimu', 'Chukwudi Okafor', 'Ibrahim Musa', 'David Nwachukwu',
    'Emmanuel Okonkwo', 'Michael Adebisi', 'Ahmed Bello', 'Samuel Okoro',
    'Joseph Egwu', 'Daniel Abubakar', 'Peter Adeleke', 'Paul Oladele'
  ],
  female: [
    'Chioma Eze', 'Fatima Abdullahi', 'Mary Adebayo', 'Grace Okoro',
    'Blessing Okafor', 'Aisha Musa', 'Ngozi Nwankwo', 'Aminat Bello',
    'Kemi Adeyemi', 'Hauwa Ibrahim', 'Chidinma Obi', 'Funmi Odunsi'
  ]
};

// Estate names with Nigerian cultural context
export const estateNames = [
  'Green Valley Estate', 'Sunset Gardens', 'Royal Heights', 'Paradise City',
  'Golden Gate Estate', 'Heritage Park', 'Crystal Gardens', 'Emerald Hills',
  'Diamond Heights', 'Platinum Villas', 'Peacehaven Estate', 'Victoria Gardens',
  'Harmony Gardens', 'Serenity Heights', 'Unity Estate', 'Prosperity Gardens',
  'New Lagos Estate', 'Abuja Gardens', 'Rivers Park', 'Ogun Heights'
];

// Professional titles and businesses common in Nigeria
export const nigerianProfessions = [
  'Real Estate Developer', 'Business Executive', 'Medical Doctor', 'Engineer',
  'Lawyer', 'Banker', 'Oil & Gas Executive', 'IT Professional', 'Entrepreneur',
  'Government Official', 'Academic', 'Contractor', 'Architect', 'Accountant'
];

/**
 * Generate realistic mock users
 */
export const generateMockUsers = (count: number = 50): User[] => {
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.5;
    const names = isMale ? nigerianNames.male : nigerianNames.female;
    const fullName = names[Math.floor(Math.random() * names.length)];
    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ')[1];
    
    users.push({
      id: `user-${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      name: fullName,
      role: Math.random() > 0.8 ? 'developer' : 'client',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  return users;
};

/**
 * Generate realistic mock estates
 */
export const generateMockEstates = (count: number = 20): Estate[] => {
  const estates: Estate[] = [];
  
  for (let i = 0; i < count; i++) {
    const location = nigerianLocations[Math.floor(Math.random() * nigerianLocations.length)];
    const totalPlots = Math.floor(Math.random() * 200) + 50; // 50-250 plots
    const allocatedPlots = Math.floor(totalPlots * (0.4 + Math.random() * 0.5)); // 40-90% allocation
    const developedPlots = Math.floor(allocatedPlots * (0.3 + Math.random() * 0.6)); // 30-90% of allocated
    const constructionPlots = Math.floor((allocatedPlots - developedPlots) * (0.4 + Math.random() * 0.4)); // 40-80% under construction
    const undevelopedPlots = totalPlots - allocatedPlots;
    
    estates.push({
      id: `estate-${i + 1}`,
      name: estateNames[Math.floor(Math.random() * estateNames.length)],
      location: `${location.city}, ${location.state}`,
      developerId: `user-${Math.floor(Math.random() * 10) + 1}`,
      totalPlots,
      allocatedPlots,
      developedPlots,
      constructionPlots,
      undevelopedPlots,
      progress: Math.floor((developedPlots / totalPlots) * 100),
      clients: allocatedPlots,
      disputes: Math.floor(Math.random() * 5),
      coordinates: location.coordinates as [number, number],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  return estates;
};

/**
 * Generate realistic mock plots for an estate
 */
export const generateMockPlots = (estate: Estate): Plot[] => {
  const plots: Plot[] = [];
  
  for (let i = 0; i < estate.totalPlots; i++) {
    const plotNumber = `${String.fromCharCode(65 + Math.floor(i / 50))}${String(i % 50 + 1).padStart(3, '0')}`;
    const isAllocated = i < estate.allocatedPlots;
    const isDeveloped = isAllocated && i < estate.developedPlots;
    const isUnderConstruction = isAllocated && !isDeveloped && i < (estate.developedPlots + estate.constructionPlots);
    
    let status: Plot['status'] = 'undeveloped';
    if (isDeveloped) status = 'developed';
    else if (isUnderConstruction) status = 'construction';
    
    // Generate realistic coordinates around the estate
    const baseCoords = estate.coordinates;
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.01;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.01;
    
    plots.push({
      id: `plot-${estate.id}-${i + 1}`,
      number: plotNumber,
      estateId: estate.id,
      status,
      size: Math.floor(Math.random() * 400) + 300, // 300-700 sqm
      price: Math.floor(Math.random() * 20000000) + 8000000, // 8M - 28M
      owner: isAllocated ? nigerianNames[Math.random() > 0.5 ? 'male' : 'female'][Math.floor(Math.random() * 12)] : undefined,
      ownerId: isAllocated ? `user-${Math.floor(Math.random() * 50) + 1}` : undefined,
      risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Plot['risk'],
      coordinates: [lat, lng] as [number, number],
      bounds: [
        [lat - 0.0002, lng - 0.0002],
        [lat + 0.0002, lng + 0.0002]
      ] as [[number, number], [number, number]],



      allocationDate: isAllocated ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) : undefined,
      constructionStartDate: isUnderConstruction || isDeveloped ? new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000) : undefined,
      constructionEndDate: isDeveloped ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,

      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  return plots;
};

/**
 * Generate realistic mock documents
 */
export const generateMockDocuments = (estates: Estate[], plots: Plot[]): Document[] => {
  const documents: Document[] = [];
  const documentTypes = ['C of O', 'Survey Plan', 'Approval', 'Receipt', 'Other'] as const;
  const documentNames = {
    'C of O': ['Certificate of Occupancy', 'C of O Document', 'Occupancy Certificate'],
    'Survey Plan': ['Survey Plan Document', 'Land Survey', 'Plot Survey Plan'],
    'Approval': ['Building Approval', 'Development Approval', 'Planning Permit'],
    'Receipt': ['Payment Receipt', 'Allocation Receipt', 'Development Levy Receipt'],
    'Other': ['Environmental Impact Assessment', 'Utility Connection', 'Title Document']
  };
  
  // Generate documents for estates
  estates.forEach(estate => {
    for (let i = 0; i < Math.floor(Math.random() * 8) + 3; i++) {
      const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const names = documentNames[type];
      
      documents.push({
        id: `doc-estate-${estate.id}-${i + 1}`,
        name: `${names[Math.floor(Math.random() * names.length)]}.pdf`,
        type,
        status: ['verified', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as any,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        estateId: estate.id,
        verificationScore: Math.floor(Math.random() * 40) + 60, // 60-100%
        fileUrl: `https://example.com/documents/${estate.id}/${i + 1}.pdf`,
        fileSize: Math.floor(Math.random() * 5000000) + 500000, // 500KB - 5MB
        mimeType: 'application/pdf',
        uploadedBy: `user-${Math.floor(Math.random() * 10) + 1}`,
        verifiedBy: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 5) + 1}` : undefined,
        verificationDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        rejectionReason: Math.random() > 0.9 ? 'Document clarity issues' : undefined,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
  });
  
  // Generate documents for some plots
  plots.filter(() => Math.random() > 0.7).forEach(plot => {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const names = documentNames[type];
      
      documents.push({
        id: `doc-plot-${plot.id}-${i + 1}`,
        name: `${names[Math.floor(Math.random() * names.length)]}_${plot.number}.pdf`,
        type,
        status: ['verified', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as any,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        estateId: plot.estateId,
        plotId: plot.id,
        verificationScore: Math.floor(Math.random() * 40) + 60,
        fileUrl: `https://example.com/documents/${plot.estateId}/${plot.id}/${i + 1}.pdf`,
        fileSize: Math.floor(Math.random() * 3000000) + 300000,
        mimeType: 'application/pdf',
        uploadedBy: plot.ownerId || `user-${Math.floor(Math.random() * 10) + 1}`,
        verifiedBy: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 5) + 1}` : undefined,
        verificationDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
  });
  
  return documents;
};

/**
 * Generate realistic construction stages for plots under construction or developed
 */
export const generateConstructionStages = (plots: Plot[]): ConstructionStage[] => {
  const stages: ConstructionStage[] = [];
  const stageTemplates = [
    { name: 'Foundation', description: 'Foundation laying and ground work', duration: 14 },
    { name: 'Block Work', description: 'Block laying and structural work', duration: 21 },
    { name: 'Roofing', description: 'Roofing and covering', duration: 10 },
    { name: 'Plumbing', description: 'Plumbing installation', duration: 7 },
    { name: 'Electrical', description: 'Electrical wiring and fittings', duration: 7 },
    { name: 'Tiling', description: 'Floor and wall tiling', duration: 14 },
    { name: 'Painting', description: 'Interior and exterior painting', duration: 10 },
    { name: 'Finishing', description: 'Final touches and cleanup', duration: 7 }
  ];
  
  plots
    .filter(plot => plot.status === 'construction' || plot.status === 'developed')
    .forEach(plot => {
      const numStages = plot.status === 'developed' ? 8 : Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < numStages; i++) {
        const template = stageTemplates[i];
        const isComplete = plot.status === 'developed' || i < numStages - Math.floor(Math.random() * 3);
        
        stages.push({
          id: `stage-${plot.id}-${i + 1}`,
          plotId: plot.id,
          name: template.name,
          description: template.description,
          date: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000),
          complete: isComplete,
          progress: isComplete ? 100 : Math.floor(Math.random() * 80) + 10,
          photos: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => 
            `https://images.unsplash.com/photo-${1560000000000 + Math.random() * 100000000}?w=400&h=300&fit=crop&crop=center`
          ),
          estimatedDuration: template.duration,
          actualDuration: isComplete ? template.duration + Math.floor(Math.random() * 7) - 3 : undefined,
          cost: Math.floor(Math.random() * 2000000) + 500000, // 500K - 2.5M
          contractor: `${nigerianNames.male[Math.floor(Math.random() * nigerianNames.male.length)]} Construction`,
          notes: Math.random() > 0.7 ? 'Work progressing as scheduled' : undefined,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    });
  
  return stages;
};

/**
 * Generate realistic notifications
 */
export const generateMockNotifications = (users: User[], estates: Estate[]): Notification[] => {
  const notifications: Notification[] = [];
  const notificationTemplates = [
    { title: 'Plot Allocation', message: 'Your plot {plotNumber} has been allocated successfully', type: 'success' },
    { title: 'Payment Due', message: 'Payment for plot {plotNumber} is due in 3 days', type: 'warning' },
    { title: 'Construction Update', message: 'Construction milestone completed for plot {plotNumber}', type: 'info' },
    { title: 'Document Verified', message: 'Your document has been verified successfully', type: 'success' },
    { title: 'Document Rejected', message: 'Your document submission requires attention', type: 'error' },
    { title: 'Estate News', message: 'New amenities added to {estateName}', type: 'info' },
    { title: 'Maintenance Schedule', message: 'Scheduled maintenance for {estateName} this weekend', type: 'info' },
    { title: 'Security Alert', message: 'Security patrol completed for {estateName}', type: 'info' }
  ];
  
  users.forEach(user => {
    const userNotificationCount = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < userNotificationCount; i++) {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const estate = estates[Math.floor(Math.random() * estates.length)];
      const plotNumber = `A${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`;
      
      let message = template.message
        .replace('{plotNumber}', plotNumber)
        .replace('{estateName}', estate.name);
      
      notifications.push({
        id: `notification-${user.id}-${i + 1}`,
        userId: user.id,
        title: template.title,
        message,
        type: template.type as any,
        read: Math.random() > 0.6,
        actionUrl: Math.random() > 0.5 ? `/estates/${estate.id}` : undefined,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
  });
  
  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Real-time data simulation functions
 */
export class MockDataService {
  private static updateCallbacks: Array<(data: any) => void> = [];
  
  static subscribe(callback: (data: any) => void) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }
  
  static startRealTimeUpdates() {
    // Simulate real-time updates every 10-30 seconds
    setInterval(() => {
      const updateType = ['plot_allocated', 'construction_progress', 'payment_received', 'document_verified'][
        Math.floor(Math.random() * 4)
      ];
      
      const mockUpdate = {
        type: updateType,
        timestamp: new Date(),
        data: this.generateRandomUpdate(updateType)
      };
      
      this.updateCallbacks.forEach(callback => callback(mockUpdate));
    }, Math.random() * 20000 + 10000); // 10-30 seconds
  }
  
  private static generateRandomUpdate(type: string) {
    switch (type) {
      case 'plot_allocated':
        return {
          plotNumber: `A${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
          ownerName: nigerianNames[Math.random() > 0.5 ? 'male' : 'female'][Math.floor(Math.random() * 12)],
          estateName: estateNames[Math.floor(Math.random() * estateNames.length)],
          amount: Math.floor(Math.random() * 20000000) + 8000000
        };
      
      case 'construction_progress':
        return {
          plotNumber: `B${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
          stageName: ['Foundation', 'Block Work', 'Roofing', 'Finishing'][Math.floor(Math.random() * 4)],
          progress: Math.floor(Math.random() * 100),
          estateName: estateNames[Math.floor(Math.random() * estateNames.length)]
        };
      
      case 'payment_received':
        return {
          amount: Math.floor(Math.random() * 5000000) + 1000000,
          ownerName: nigerianNames[Math.random() > 0.5 ? 'male' : 'female'][Math.floor(Math.random() * 12)],
          paymentType: ['Initial Deposit', 'Development Levy', 'Final Payment'][Math.floor(Math.random() * 3)]
        };
      
      case 'document_verified':
        return {
          documentType: ['C of O', 'Survey Plan', 'Building Approval'][Math.floor(Math.random() * 3)],
          ownerName: nigerianNames[Math.random() > 0.5 ? 'male' : 'female'][Math.floor(Math.random() * 12)],
          verificationScore: Math.floor(Math.random() * 30) + 70
        };
      
      default:
        return {};
    }
  }
}

// Advanced analytics mock data
export const generateAnalyticsData = (estates: Estate[], _plots?: Plot[]) => {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    revenue: {
      monthly: months.map(month => ({
        month,
        revenue: Math.floor(Math.random() * 50000000) + 20000000,
        target: Math.floor(Math.random() * 40000000) + 30000000,
        growth: Math.floor(Math.random() * 30) - 5 // -5% to +25%
      })),
      yearly: Array.from({ length: 5 }, (_, i) => ({
        year: currentYear - 4 + i,
        revenue: Math.floor(Math.random() * 500000000) + 200000000,
        growth: Math.floor(Math.random() * 40) - 10
      }))
    },
    
    occupancy: {
      overall: Math.floor(Math.random() * 30) + 60, // 60-90%
      byEstate: estates.map(estate => ({
        name: estate.name,
        occupancy: Math.floor((estate.allocatedPlots / estate.totalPlots) * 100),
        trend: Math.floor(Math.random() * 20) - 5
      }))
    },
    
    geographic: nigerianLocations.map(location => ({
      state: location.state,
      city: location.city,
      properties: Math.floor(Math.random() * 50) + 10,
      value: Math.floor(Math.random() * 2000000000) + 500000000,
      growth: Math.floor(Math.random() * 40) - 10
    })),
    
    market: {
      trends: [
        { factor: 'Location Premium', impact: 8.5, trend: 'up' },
        { factor: 'Infrastructure Development', impact: 12.3, trend: 'up' },
        { factor: 'Economic Conditions', impact: -3.2, trend: 'down' },
        { factor: 'Government Policies', impact: 5.7, trend: 'up' },
        { factor: 'Population Growth', impact: 9.1, trend: 'up' }
      ],
      
      predictions: months.slice(0, 6).map(month => ({
        month,
        predictedSales: Math.floor(Math.random() * 30) + 15,
        confidence: Math.floor(Math.random() * 20) + 75,
        priceRange: {
          min: Math.floor(Math.random() * 5000000) + 8000000,
          max: Math.floor(Math.random() * 10000000) + 25000000
        }
      }))
    }
  };
};

// Export all generated data as a complete dataset
export const generateCompleteDataset = () => {
  const users = generateMockUsers(100);
  const estates = generateMockEstates(25);
  const plots = estates.flatMap(estate => generateMockPlots(estate));
  const documents = generateMockDocuments(estates, plots);
  const constructionStages = generateConstructionStages(plots);
  const notifications = generateMockNotifications(users, estates);
  const analytics = generateAnalyticsData(estates, plots);
  
  return {
    users,
    estates,
    plots,
    documents,
    constructionStages,
    notifications,
    analytics,
    meta: {
      generatedAt: new Date(),
      totalUsers: users.length,
      totalEstates: estates.length,
      totalPlots: plots.length,
      totalDocuments: documents.length,
      totalNotifications: notifications.length
    }
  };
};

export default {
  nigerianLocations,
  nigerianNames,
  estateNames,
  generateMockUsers,
  generateMockEstates,
  generateMockPlots,
  generateMockDocuments,
  generateConstructionStages,
  generateMockNotifications,
  generateAnalyticsData,
  generateCompleteDataset,
  MockDataService
};
