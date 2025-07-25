import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';

/**
 * Enhanced accessibility components for EstateTracker
 */

// Screen Reader Only Text Component
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

// Focus Trap Component for Modals
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}> = ({ children, isActive, onEscape }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isActive, onEscape, getFocusableElements]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus first element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isActive, handleKeyDown, getFocusableElements]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
};

// Live Region for Dynamic Content Updates
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  priority?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all' | 'additions text';
}> = ({ 
  children, 
  priority = 'polite', 
  atomic = false, 
  relevant = 'additions text' 
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className="sr-only"
    >
      {children}
    </div>
  );
};

// Skip Link Component
export const SkipLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg"
    >
      {children}
    </a>
  );
};

// Accessible Button with Enhanced States
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
}> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading && (
        <svg
          className="w-4 h-4 mr-2 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Accessible Form Field with Enhanced Labels and Descriptions
export const AccessibleFormField: React.FC<{
  label: string;
  children: React.ReactNode;
  error?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
}> = ({ label, children, error, helpText, required, className = '' }) => {
  const fieldId = useRef(`field-${Math.random().toString(36).substr(2, 9)}`);
  const errorId = useRef(`error-${Math.random().toString(36).substr(2, 9)}`);
  const helpId = useRef(`help-${Math.random().toString(36).substr(2, 9)}`);

  const getAriaDescribedBy = () => {
    const descriptions = [];
    if (helpText) descriptions.push(helpId.current);
    if (error) descriptions.push(errorId.current);
    return descriptions.length > 0 ? descriptions.join(' ') : undefined;
  };

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={fieldId.current}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {helpText && (
        <p id={helpId.current} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id: fieldId.current,
        'aria-describedby': getAriaDescribedBy(),
        'aria-invalid': !!error,
        required
      })}
      
      {error && (
        <p id={errorId.current} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// High Contrast Mode Detection and Toggle
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('high-contrast', newValue);
      localStorage.setItem('high-contrast', newValue.toString());
      return newValue;
    });
  }, []);

  return { isHighContrast, toggleHighContrast };
};

// Reduced Motion Detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Keyboard Navigation Announcement
export const KeyboardNavigationAnnouncer: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.getAttribute('aria-label')) {
          setAnnouncement(`Focused on ${activeElement.getAttribute('aria-label')}`);
        } else if (activeElement?.textContent) {
          setAnnouncement(`Focused on ${activeElement.textContent.trim()}`);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LiveRegion priority="polite">
      {announcement}
    </LiveRegion>
  );
};

// Accessible Progress Bar
export const AccessibleProgressBar: React.FC<{
  value: number;
  max?: number;
  label?: string;
  className?: string;
}> = ({ value, max = 100, label, className = '' }) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage}%`}
        className="w-full bg-gray-200 rounded-full h-2.5"
      >
        <div
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default {
  ScreenReaderOnly,
  FocusTrap,
  LiveRegion,
  SkipLink,
  AccessibleButton,
  AccessibleFormField,
  useHighContrast,
  useReducedMotion,
  KeyboardNavigationAnnouncer,
  AccessibleProgressBar
};
