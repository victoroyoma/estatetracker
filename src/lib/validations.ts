import { z } from 'zod';

// Utility schemas for common validation patterns
const nigerianPhoneSchema = z.string().regex(
  /^(\+234|234|0)[789][01][0-9]{8}$/,
  'Please enter a valid Nigerian phone number'
);

const ninSchema = z.string().regex(
  /^[0-9]{11}$/,
  'NIN must be exactly 11 digits'
);

const bvnSchema = z.string()
  .regex(/^[0-9]{11}$/, 'BVN must be exactly 11 digits')
  .refine((bvn) => {
    // Enhanced BVN validation with checksum algorithm
    const digits = bvn.split('').map(Number);
    const weights = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7];
    const sum = digits.slice(0, 10).reduce((acc, digit, idx) => acc + (digit * weights[idx]), 0);
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[10];
  }, 'Invalid BVN format or checksum');

const coordinatesSchema = z.tuple([
  z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  z.number().min(-180).max(180, 'Longitude must be between -180 and 180')
]);

// Password validation with strength requirements
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// File validation schema
const fileSchema = z.custom<File>((file) => file instanceof File, 'Please select a file')
  .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
    'File must be JPEG, PNG, WebP, or PDF'
  );

// User schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['developer', 'client'], {
    required_error: 'Please select a role',
  }),
  companyName: z.string().optional(),
  phone: nigerianPhoneSchema.optional(),
  nin: ninSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: nigerianPhoneSchema.optional(),
  companyName: z.string().optional(),
  avatar: fileSchema.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Estate schemas
export const estateSchema = z.object({
  name: z.string().min(2, 'Estate name must be at least 2 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  totalPlots: z.number().min(1, 'Total plots must be at least 1').max(10000, 'Maximum 10,000 plots allowed'),
  coordinates: coordinatesSchema,
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  image: fileSchema.optional(),
});

export const updateEstateSchema = estateSchema.partial();

// Plot schemas
export const plotSchema = z.object({
  number: z.string().min(1, 'Plot number is required'),
  estateId: z.string().min(1, 'Estate ID is required'),
  size: z.number().min(1, 'Plot size must be at least 1 square meter'),
  price: z.number().min(0, 'Price must be positive'),
  coordinates: coordinatesSchema,
  bounds: z.tuple([coordinatesSchema, coordinatesSchema]),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updatePlotSchema = plotSchema.partial().omit({ estateId: true });

export const allocatePlotSchema = z.object({
  plotId: z.string().min(1, 'Plot ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  allocationDate: z.date(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

// Document schemas
export const documentUploadSchema = z.object({
  file: fileSchema,
  type: z.enum(['C of O', 'Survey Plan', 'Approval', 'Receipt', 'Other'], {
    required_error: 'Please select a document type',
  }),
  plotId: z.string().optional(),
  estateId: z.string().min(1, 'Estate ID is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const documentVerificationSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  status: z.enum(['verified', 'rejected'], {
    required_error: 'Please select verification status',
  }),
  verificationScore: z.number().min(0).max(100),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  rejectionReason: z.string().max(500, 'Rejection reason must be less than 500 characters').optional(),
});

// Construction schemas
export const constructionStageSchema = z.object({
  plotId: z.string().min(1, 'Plot ID is required'),
  name: z.string().min(2, 'Stage name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  estimatedDuration: z.number().min(1, 'Estimated duration must be at least 1 day'),
  cost: z.number().min(0, 'Cost must be positive'),
  contractor: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const updateConstructionStageSchema = z.object({
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),
  actualDuration: z.number().min(1, 'Actual duration must be at least 1 day').optional(),
  photos: z.array(fileSchema).max(10, 'Maximum 10 photos allowed').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  complete: z.boolean(),
});

// Payment schemas
export const paymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.enum(['NGN'], { required_error: 'Currency is required' }),
  email: z.string().email('Please enter a valid email address'),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const subscriptionSchema = z.object({
  plan: z.enum(['basic', 'premium'], {
    required_error: 'Please select a plan',
  }),
  billingCycle: z.enum(['monthly', 'yearly'], {
    required_error: 'Please select a billing cycle',
  }),
});

// Notification schemas
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be less than 500 characters'),
  type: z.enum(['info', 'success', 'warning', 'error'], {
    required_error: 'Notification type is required',
  }),
  recipientId: z.string().min(1, 'Recipient ID is required'),
  actionUrl: z.string().url('Please enter a valid URL').optional(),
});

// Search and filter schemas
export const plotFilterSchema = z.object({
  status: z.array(z.enum(['developed', 'undeveloped', 'construction'])).optional(),
  risk: z.array(z.enum(['low', 'medium', 'high'])).optional(),
  ownership: z.enum(['allocated', 'unallocated']).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  sizeRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query must be less than 100 characters'),
  filters: plotFilterSchema.optional(),
});

// Contact schemas
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: nigerianPhoneSchema.optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

// Settings schemas
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: 'Please select a theme',
  }),
  language: z.enum(['en', 'ig', 'yo', 'ha'], {
    required_error: 'Please select a language',
  }),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private']),
    shareData: z.boolean(),
  }),
});

// Advanced BVN validation with Bank lookup integration
export const advancedBvnSchema = bvnSchema
  .refine(async (bvn) => {
    // Simulate bank verification API call
    try {
      // In production, this would call actual bank verification API
      const response = await fetch(`/api/verify-bvn/${bvn}`);
      return response.ok;
    } catch {
      return false; // Allow offline operation
    }
  }, 'BVN verification failed with bank records');

// Enhanced Nigerian National ID validation
export const advancedNinSchema = ninSchema
  .refine((nin) => {
    // Advanced NIN validation with state code verification
    const stateCode = nin.substring(0, 2);
    const validStateCodes = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '31', '32', '33', '34', '35', '36', '37'
    ];
    return validStateCodes.includes(stateCode);
  }, 'Invalid NIN: State code not recognized')
  .refine((nin) => {
    // Birth year validation (1900-2024)
    const birthYear = parseInt(nin.substring(2, 4)) + (parseInt(nin.substring(2, 4)) > 50 ? 1900 : 2000);
    const currentYear = new Date().getFullYear();
    return birthYear >= 1900 && birthYear <= currentYear;
  }, 'Invalid NIN: Birth year out of range');

// AI-powered document verification schema
export const aiDocumentVerificationSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  documentType: z.enum(['C of O', 'Survey Plan', 'Approval', 'Receipt', 'Building Plan', 'Land Use Act', 'Deed of Assignment'], {
    required_error: 'Please select a document type',
  }),
  aiAnalysis: z.object({
    confidence: z.number().min(0).max(100),
    authenticity: z.enum(['authentic', 'suspicious', 'fake']),
    extractedData: z.record(z.any()),
    anomalies: z.array(z.string()),
    signatureVerification: z.boolean(),
    watermarkDetection: z.boolean(),
  }),
  manualVerification: z.object({
    verified: z.boolean(),
    verifiedBy: z.string(),
    verificationDate: z.date(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  }).optional(),
});

// Blockchain property verification schema
export const blockchainVerificationSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  blockNumber: z.number().positive('Block number must be positive'),
  networkId: z.enum(['1', '56', '137', '43114'], {
    required_error: 'Please select a network',
  }),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
  verificationStatus: z.enum(['pending', 'confirmed', 'failed']),
  gasUsed: z.number().positive().optional(),
  timestamp: z.date(),
});

// Geospatial property boundary validation
export const propertyBoundarySchema = z.object({
  coordinates: z.array(
    z.tuple([
      z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
      z.number().min(-90).max(90, 'Latitude must be between -90 and 90')
    ])
  ).min(3, 'Property boundary must have at least 3 coordinate points'),
  totalArea: z.number().positive('Total area must be positive'),
  perimeter: z.number().positive('Perimeter must be positive'),
  elevation: z.number().optional(),
  soilType: z.enum(['clay', 'sand', 'loam', 'rocky', 'mixed'], {
    required_error: 'Please select soil type',
  }).optional(),
  floodRisk: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please assess flood risk',
  }).optional(),
  accessRoads: z.array(z.string()).min(1, 'At least one access road is required'),
});

// Smart contract integration schema
export const smartContractSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
  functionName: z.string().min(1, 'Function name is required'),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    value: z.any(),
  })),
  gasLimit: z.number().positive('Gas limit must be positive'),
  gasPrice: z.number().positive('Gas price must be positive'),
  value: z.number().nonnegative('Value must be non-negative').optional(),
});

// Environmental compliance schema
export const environmentalComplianceSchema = z.object({
  environmentalImpactAssessment: z.boolean(),
  wasteManagementPlan: z.boolean(),
  waterSourceApproval: z.boolean(),
  treeClearancePermit: z.boolean().optional(),
  airQualityAssessment: z.boolean().optional(),
  noiseImpactStudy: z.boolean().optional(),
  wetlandAssessment: z.boolean().optional(),
  complianceDate: z.date(),
  validityPeriod: z.number().positive('Validity period must be positive'),
  renewalRequired: z.boolean(),
});

// Financial verification schema with Nigerian banking integration
export const financialVerificationSchema = z.object({
  bankName: z.enum([
    'Access Bank', 'Zenith Bank', 'GTBank', 'First Bank', 'UBA',
    'Fidelity Bank', 'FCMB', 'Sterling Bank', 'Unity Bank', 'Keystone Bank',
    'Wema Bank', 'Polaris Bank', 'Stanbic IBTC', 'Ecobank', 'Heritage Bank'
  ], {
    required_error: 'Please select a Nigerian bank',
  }),
  accountNumber: z.string().regex(/^[0-9]{10}$/, 'Account number must be exactly 10 digits'),
  accountName: z.string().min(2, 'Account name must be at least 2 characters'),
  bvn: advancedBvnSchema,
  proofOfIncome: z.object({
    documentType: z.enum(['salary_slip', 'bank_statement', 'tax_certificate', 'business_registration']),
    monthlyIncome: z.number().positive('Monthly income must be positive'),
    employmentStatus: z.enum(['employed', 'self_employed', 'business_owner', 'retired']),
    yearsOfEmployment: z.number().nonnegative('Years of employment must be non-negative'),
  }),
  creditScore: z.number().min(300).max(850).optional(),
  existingLoans: z.array(z.object({
    lender: z.string(),
    amount: z.number().positive(),
    monthlyPayment: z.number().positive(),
    remainingTerm: z.number().positive(),
  })).optional(),
});

// Multi-signature approval schema
export const multiSignatureSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  requiredSignatures: z.number().min(2, 'At least 2 signatures required'),
  signatures: z.array(z.object({
    signerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid signer address'),
    signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format'),
    timestamp: z.date(),
    ipAddress: z.string().ip('Invalid IP address'),
    userAgent: z.string().optional(),
  })),
  threshold: z.number().min(1, 'Threshold must be at least 1'),
  deadline: z.date().refine((date) => date > new Date(), 'Deadline must be in the future'),
  metadata: z.record(z.any()).optional(),
});

// Biometric verification schema
export const biometricVerificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  biometricType: z.enum(['fingerprint', 'facial_recognition', 'voice_print', 'iris_scan']),
  templateHash: z.string().min(64, 'Biometric template hash required'),
  confidence: z.number().min(80, 'Confidence must be at least 80%').max(100),
  liveness: z.boolean(), // Anti-spoofing check
  timestamp: z.date(),
  deviceId: z.string().min(1, 'Device ID is required'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().positive(),
  }).optional(),
});

// Enhanced estate planning schema
export const estateProjectSchema = z.object({
  projectName: z.string().min(2, 'Project name must be at least 2 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  masterPlan: z.object({
    totalArea: z.number().positive('Total area must be positive'),
    residentialArea: z.number().positive('Residential area must be positive'),
    commercialArea: z.number().nonnegative('Commercial area must be non-negative'),
    recreationalArea: z.number().nonnegative('Recreational area must be non-negative'),
    roadNetwork: z.number().positive('Road network area must be positive'),
    utilities: z.object({
      waterSupply: z.boolean(),
      electricityGrid: z.boolean(),
      sewerageSystem: z.boolean(),
      gasPipeline: z.boolean().optional(),
      fiberOptic: z.boolean().optional(),
    }),
  }),
  phases: z.array(z.object({
    phaseName: z.string().min(1, 'Phase name is required'),
    startDate: z.date(),
    endDate: z.date(),
    plotCount: z.number().positive('Plot count must be positive'),
    estimatedCost: z.number().positive('Estimated cost must be positive'),
    infrastructure: z.array(z.string()),
  })).min(1, 'At least one phase is required'),
  regulatory: z.object({
    estateSurveyApproval: z.boolean(),
    masterPlanApproval: z.boolean(),
    environmentalImpactApproval: z.boolean(),
    buildingPermits: z.boolean(),
    roadConstructionPermit: z.boolean(),
    utilityConnections: z.boolean(),
  }),
  financing: z.object({
    totalProjectCost: z.number().positive('Total project cost must be positive'),
    equityContribution: z.number().nonnegative('Equity contribution must be non-negative'),
    loanFinancing: z.number().nonnegative('Loan financing must be non-negative'),
    preSellingRevenue: z.number().nonnegative('Pre-selling revenue must be non-negative'),
    contingencyFund: z.number().positive('Contingency fund must be positive'),
  }),
});

// Type exports for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EstateFormData = z.infer<typeof estateSchema>;
export type PlotFormData = z.infer<typeof plotSchema>;
export type DocumentUploadData = z.infer<typeof documentUploadSchema>;
export type ConstructionStageData = z.infer<typeof constructionStageSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;
export type PlotFilterData = z.infer<typeof plotFilterSchema>;

// Type exports for the new schemas
export type AdvancedBvnData = z.infer<typeof advancedBvnSchema>;
export type AdvancedNinData = z.infer<typeof advancedNinSchema>;
export type AiDocumentVerificationData = z.infer<typeof aiDocumentVerificationSchema>;
export type BlockchainVerificationData = z.infer<typeof blockchainVerificationSchema>;
export type PropertyBoundaryData = z.infer<typeof propertyBoundarySchema>;
export type SmartContractData = z.infer<typeof smartContractSchema>;
export type EnvironmentalComplianceData = z.infer<typeof environmentalComplianceSchema>;
export type FinancialVerificationData = z.infer<typeof financialVerificationSchema>;
export type MultiSignatureData = z.infer<typeof multiSignatureSchema>;
export type BiometricVerificationData = z.infer<typeof biometricVerificationSchema>;
export type EstateProjectData = z.infer<typeof estateProjectSchema>;

// Validation error helper
export function getValidationErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}

// Enhanced validation helper with detailed error reporting
export function getDetailedValidationErrors(error: z.ZodError) {
  const errors: Record<string, { message: string; code: string; path: string }> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = {
      message: err.message,
      code: err.code,
      path: path
    };
  });
  
  return errors;
}

// Validation utilities for Nigerian-specific data
export const nigerianValidationUtils = {
  // Validate Nigerian state codes
  validateStateCode: (code: string): boolean => {
    const validCodes = [
      'AB', 'AD', 'AK', 'AN', 'BA', 'BY', 'BE', 'BO', 'CR', 'DE',
      'EB', 'ED', 'EK', 'EN', 'FC', 'GO', 'IM', 'JI', 'KD', 'KN',
      'KT', 'KE', 'KO', 'KW', 'LA', 'NA', 'NI', 'OG', 'ON', 'OS',
      'OY', 'PL', 'RI', 'SO', 'TA', 'YO', 'ZA'
    ];
    return validCodes.includes(code.toUpperCase());
  },

  // Validate Nigerian postal codes
  validatePostalCode: (code: string): boolean => {
    return /^[0-9]{6}$/.test(code);
  },

  // Extract state from NIN
  getStateFromNin: (nin: string): string | null => {
    const stateMap: Record<string, string> = {
      '01': 'Abia', '02': 'Adamawa', '03': 'Akwa Ibom', '04': 'Anambra',
      '05': 'Bauchi', '06': 'Bayelsa', '07': 'Benue', '08': 'Borno',
      '09': 'Cross River', '10': 'Delta', '11': 'Ebonyi', '12': 'Edo',
      '13': 'Ekiti', '14': 'Enugu', '15': 'FCT', '16': 'Gombe',
      '17': 'Imo', '18': 'Jigawa', '19': 'Kaduna', '20': 'Kano',
      '21': 'Katsina', '22': 'Kebbi', '23': 'Kogi', '24': 'Kwara',
      '25': 'Lagos', '26': 'Nasarawa', '27': 'Niger', '28': 'Ogun',
      '29': 'Ondo', '30': 'Osun', '31': 'Oyo', '32': 'Plateau',
      '33': 'Rivers', '34': 'Sokoto', '35': 'Taraba', '36': 'Yobe',
      '37': 'Zamfara'
    };
    return stateMap[nin.substring(0, 2)] || null;
  },

  // Generate property reference number
  generatePropertyReference: (stateCode: string, lga: string, estateCode: string): string => {
    const timestamp = Date.now().toString().slice(-6);
    return `${stateCode}-${lga.substring(0, 3).toUpperCase()}-${estateCode}-${timestamp}`;
  },

  // Validate Nigerian tax identification number
  validateTin: (tin: string): boolean => {
    return /^[0-9]{8}-[0-9]{4}$/.test(tin);
  }
};
