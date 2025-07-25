import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  padding = 'none'
}) => {
  const variantClasses = {
    default: 'bg-white shadow-soft',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-medium'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div 
      className={cn(
        'rounded-lg overflow-hidden',
        variantClasses[variant],
        paddingClasses[padding],
        onClick ? 'cursor-pointer hover:shadow-medium transition-shadow' : '',
        className
      )} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}> = ({
  children,
  className = '',
  actions
}) => {
  return (
    <div className={cn('px-4 py-3 border-b border-gray-200', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        {actions && <div className="flex-shrink-0 ml-4">{actions}</div>}
      </div>
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({
  children,
  className = '',
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6'
  };

  return (
    <div className={cn(paddingClasses[padding], className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted';
}> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'px-4 py-3 border-t border-gray-200',
    muted: 'px-4 py-3 bg-gray-50 border-t border-gray-200'
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  );
};

export default Card;