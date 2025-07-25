import React from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from './Loading';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = [
    'inline-flex items-center justify-center rounded-md font-medium',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
  ].join(' ');

  const variantStyles = {
    primary: [
      'bg-primary-600 text-white shadow-sm',
      'hover:bg-primary-700 hover:shadow-md',
      'focus-visible:ring-primary-500',
      'active:bg-primary-800',
    ].join(' '),
    secondary: [
      'bg-secondary-600 text-white shadow-sm',
      'hover:bg-secondary-700 hover:shadow-md',
      'focus-visible:ring-secondary-500',
      'active:bg-secondary-800',
    ].join(' '),
    outline: [
      'border border-gray-300 bg-white text-gray-700 shadow-sm',
      'hover:bg-gray-50 hover:border-gray-400',
      'focus-visible:ring-primary-500',
      'active:bg-gray-100',
    ].join(' '),
    accent: [
      'bg-accent-600 text-white shadow-sm',
      'hover:bg-accent-700 hover:shadow-md',
      'focus-visible:ring-accent-500',
      'active:bg-accent-800',
    ].join(' '),
    ghost: [
      'text-gray-700 bg-transparent',
      'hover:bg-gray-100 hover:text-gray-900',
      'focus-visible:ring-gray-500',
      'active:bg-gray-200',
    ].join(' '),
    destructive: [
      'bg-red-600 text-white shadow-sm',
      'hover:bg-red-700 hover:shadow-md',
      'focus-visible:ring-red-500',
      'active:bg-red-800',
    ].join(' '),
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-11 px-8 text-base gap-2',
    xl: 'h-12 px-10 text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-5 w-5',
  };

  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const content = (
    <>
      {loading && (
        <LoadingSpinner
          size="sm"
          color={variant === 'outline' || variant === 'ghost' ? 'gray' : 'white'}
          className={cn(iconSizes[size])}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {icon}
        </span>
      )}
      
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {icon}
        </span>
      )}
    </>
  );

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      onClick={handleClick}
      aria-disabled={isDisabled}
      {...props}
    >
      {content}
    </button>
  );
};

// Icon button variant
export const IconButton: React.FC<Omit<ButtonProps, 'children'> & {
  icon: React.ReactNode;
  'aria-label': string;
}> = ({ icon, className, size = 'md', ...props }) => {
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-11 w-11',
    xl: 'h-12 w-12',
  };

  return (
    <Button
      className={cn(sizeStyles[size], 'p-0', className)}
      size={size}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Button group component
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}> = ({ children, className, orientation = 'horizontal' }) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        '[&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none',
        '[&>button:not(:first-child)]:-ml-px',
        orientation === 'vertical' && [
          '[&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none',
          '[&>button:not(:first-child)]:-mt-px [&>button]:ml-0',
        ],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};

export default Button;