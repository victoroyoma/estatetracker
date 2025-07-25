/**
 * Comprehensive data validation and sanitization utilities
 */

export class DataValidator {
  /**
   * Validate and sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .slice(0, 1000); // Limit length
  }

  /**
   * Validate email format (more comprehensive than basic regex)
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    const sanitizedEmail = this.sanitizeInput(email);
    
    // RFC 5322 compliant regex (simplified)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(sanitizedEmail)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    if (sanitizedEmail.length > 254) {
      return { isValid: false, error: 'Email too long' };
    }

    return { isValid: true };
  }

  /**
   * Validate Nigerian phone number
   */
  static validateNigerianPhone(phone: string): { isValid: boolean; error?: string; formatted?: string } {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Nigerian phone patterns
    const patterns = [
      /^0[789][01]\d{8}$/, // 11 digits starting with 070, 080, 081, 090, 091
      /^234[789][01]\d{8}$/, // 14 digits starting with 234
      /^[789][01]\d{8}$/ // 10 digits starting with 7, 8, or 9
    ];

    const isValid = patterns.some(pattern => pattern.test(cleaned));

    if (!isValid) {
      return { isValid: false, error: 'Invalid Nigerian phone number format' };
    }

    // Format to standard Nigerian format
    let formatted = cleaned;
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      formatted = `+234${cleaned.slice(1)}`;
    } else if (cleaned.length === 10) {
      formatted = `+234${cleaned}`;
    } else if (cleaned.length === 14 && cleaned.startsWith('234')) {
      formatted = `+${cleaned}`;
    }

    return { isValid: true, formatted };
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
    } = options;

    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    // Check file size
    if (file.size > maxSize) {
      return { isValid: false, error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit` };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { isValid: false, error: 'File extension not allowed' };
    }

    // Additional security checks
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return { isValid: false, error: 'Invalid file name' };
    }

    return { isValid: true };
  }

  /**
   * Validate coordinate (latitude/longitude)
   */
  static validateCoordinate(lat: number, lng: number): { isValid: boolean; error?: string } {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { isValid: false, error: 'Coordinates must be numbers' };
    }

    if (lat < -90 || lat > 90) {
      return { isValid: false, error: 'Latitude must be between -90 and 90' };
    }

    if (lng < -180 || lng > 180) {
      return { isValid: false, error: 'Longitude must be between -180 and 180' };
    }

    // Check if coordinates are in Nigeria (approximate bounds)
    const nigeriaBounds = {
      north: 13.9,
      south: 4.2,
      east: 14.7,
      west: 2.6
    };

    if (lat < nigeriaBounds.south || lat > nigeriaBounds.north ||
        lng < nigeriaBounds.west || lng > nigeriaBounds.east) {
      return { isValid: false, error: 'Coordinates appear to be outside Nigeria' };
    }

    return { isValid: true };
  }

  /**
   * Validate price/amount
   */
  static validateAmount(amount: number | string, options: {
    min?: number;
    max?: number;
    currency?: 'NGN' | 'USD';
  } = {}): { isValid: boolean; error?: string; formatted?: string } {
    const { min = 0, max = Number.MAX_SAFE_INTEGER, currency = 'NGN' } = options;

    let numAmount: number;
    if (typeof amount === 'string') {
      // Remove currency symbols and commas
      const cleaned = amount.replace(/[₦$,\s]/g, '');
      numAmount = parseFloat(cleaned);
    } else {
      numAmount = amount;
    }

    if (isNaN(numAmount)) {
      return { isValid: false, error: 'Invalid amount format' };
    }

    if (numAmount < min) {
      return { isValid: false, error: `Amount must be at least ${min}` };
    }

    if (numAmount > max) {
      return { isValid: false, error: `Amount cannot exceed ${max}` };
    }

    // Format amount
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(numAmount);

    return { isValid: true, formatted };
  }

  /**
   * Batch validate multiple fields
   */
  static validateBatch(data: Record<string, any>, validationRules: Record<string, Function>): {
    isValid: boolean;
    errors: Record<string, string>;
    validData: Record<string, any>;
  } {
    const errors: Record<string, string> = {};
    const validData: Record<string, any> = {};

    for (const [field, value] of Object.entries(data)) {
      const validator = validationRules[field];
      if (validator) {
        const result = validator(value);
        if (result.isValid) {
          validData[field] = result.formatted || value;
        } else {
          errors[field] = result.error;
        }
      } else {
        validData[field] = value; // No validation rule, pass through
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      validData
    };
  }
}

export default DataValidator;
