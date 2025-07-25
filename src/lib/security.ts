import { User } from '../types';
import { env } from './env';

// Security utilities for the EstateTracker application

/**
 * Input sanitization to prevent XSS attacks
 */
export class SecurityUtils {
  // HTML entities to escape
  private static htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  /**
   * Escape HTML to prevent XSS
   */
  static escapeHtml(str: string): string {
    return String(str).replace(/[&<>"'`=\/]/g, (s) => SecurityUtils.htmlEntities[s]);
  }

  /**
   * Sanitize input for database operations
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate file uploads
   */
  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed. Please upload images, PDF, or Word documents only.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { isValid: true };
  }

  /**
   * Generate secure random string
   */
  static generateSecureId(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const cryptoObj = window.crypto || (window as any).msCrypto;
    
    if (cryptoObj && cryptoObj.getRandomValues) {
      const randomArray = new Uint8Array(length);
      cryptoObj.getRandomValues(randomArray);
      
      for (let i = 0; i < length; i++) {
        result += chars[randomArray[i] % chars.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Check password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    // Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score
    };
  }

  /**
   * Rate limiting check (client-side)
   */
  static checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Remove old requests outside the window
    const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
    
    return true;
  }

  /**
   * Create Content Security Policy header value
   */
  static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.estatetracker.ng",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
  }
}

/**
 * Authentication token management with security
 */
export class TokenManager {
  private static readonly TOKEN_KEY = 'estate_tracker_token';
  private static readonly REFRESH_KEY = 'estate_tracker_refresh';

  static setTokens(accessToken: string, refreshToken?: string): void {
    try {
      // Store in localStorage (consider using httpOnly cookies in production)
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Failed to store authentication tokens:', error);
    }
  }

  static getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_KEY);
    } catch {
      return null;
    }
  }

  static clearTokens(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true; // Treat invalid tokens as expired
    }
  }
}

/**
 * Audit logging for security events
 */
export class AuditLogger {
  private static logs: Array<{
    timestamp: number;
    event: string;
    details: any;
    userId?: string;
  }> = [];

  static log(event: string, details: any = {}, userId?: string): void {
    this.logs.push({
      timestamp: Date.now(),
      event,
      details,
      userId
    });

    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // In production, send to logging service
    if (env.NODE_ENV === 'production') {
      this.sendToLoggingService(event, details, userId);
    }
  }

  private static sendToLoggingService(event: string, details: any, userId?: string): void {
    // Implementation for sending to external logging service
    // This could be Sentry, LogRocket, or custom logging endpoint
    console.log('Security Event:', { event, details, userId });
  }

  static getLogs(): typeof AuditLogger.logs {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}

/**
 * Permission checking utilities
 */
export class PermissionChecker {
  static canAccessEstate(user: User, _estateId: string): boolean {
    if (!user) return false;

    // Admins can access everything
    if (user.role === 'admin') return true;

    // Developers can access their own estates
    if (user.role === 'developer') {
      // This would need to check against user's estates in real implementation
      return true;
    }

    // Clients can only access estates they have plots in
    if (user.role === 'client') {
      // This would check user's plot allocations
      return true;
    }

    return false;
  }

  static canModifyEstate(user: User, _estateId: string): boolean {
    if (!user) return false;

    // Only admins and estate owners can modify
    return user.role === 'admin' || user.role === 'developer';
  }

  static canUploadDocuments(user: User): boolean {
    if (!user) return false;
    return ['admin', 'developer'].includes(user.role);
  }

  static canViewAnalytics(user: User): boolean {
    if (!user) return false;
    return ['admin', 'developer'].includes(user.role);
  }
}

export default SecurityUtils;
