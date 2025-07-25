import React from 'react';
interface PatternProps {
  variant?: 'adire' | 'ankara' | 'geometric' | 'tribal';
  className?: string;
  opacity?: number;
}
const NigerianPatterns: React.FC<PatternProps> = ({
  variant = 'geometric',
  className = '',
  opacity = 0.15
}) => {
  // Different Nigerian-inspired patterns
  const patterns = {
    adire: <svg className={`${className}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="adirePattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M0,10 L20,10 M10,0 L10,20" stroke="currentColor" strokeWidth="1" fill="none" opacity={opacity} />
            <circle cx="10" cy="10" r="3" fill="currentColor" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adirePattern)" />
      </svg>,
    ankara: <svg className={`${className}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ankaraPattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="1" fill="none" opacity={opacity} />
            <circle cx="15" cy="15" r="5" fill="currentColor" opacity={opacity} />
            <circle cx="0" cy="0" r="3" fill="currentColor" opacity={opacity} />
            <circle cx="30" cy="0" r="3" fill="currentColor" opacity={opacity} />
            <circle cx="0" cy="30" r="3" fill="currentColor" opacity={opacity} />
            <circle cx="30" cy="30" r="3" fill="currentColor" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ankaraPattern)" />
      </svg>,
    geometric: <svg className={`${className}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geometricPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M0,0 L20,20 M20,0 L0,20" stroke="currentColor" strokeWidth="1" opacity={opacity} />
            <rect x="8" y="8" width="4" height="4" fill="currentColor" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometricPattern)" />
      </svg>,
    tribal: <svg className={`${className}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tribalPattern" patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M0,20 L40,20 M20,0 L20,40" stroke="currentColor" strokeWidth="1" opacity={opacity} />
            <path d="M10,10 L30,10 L30,30 L10,30 Z" stroke="currentColor" fill="none" strokeWidth="1" opacity={opacity} />
            <path d="M15,15 L25,15 L25,25 L15,25 Z" fill="currentColor" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tribalPattern)" />
      </svg>
  };
  return patterns[variant];
};
export default NigerianPatterns;