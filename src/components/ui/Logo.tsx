import React from 'react';
interface LogoProps {
  className?: string;
}
const Logo: React.FC<LogoProps> = ({
  className = 'h-8 w-8'
}) => {
  return <div className={`relative ${className}`}>
      <div className="absolute inset-0">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#0E6D31" />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2">
          <path d="M12 2L19 9H5L12 2Z" fill="#F59E0B" stroke="currentColor" strokeWidth="1" />
          <circle cx="12" cy="14" r="3" fill="#1E40AF" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>;
};
export default Logo;