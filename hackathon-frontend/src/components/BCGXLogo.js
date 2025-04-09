import React from 'react';

const TalentXLogo = ({ className = "h-12 w-auto" }) => {
  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      <svg className="h-full" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="40" fill="white" fontFamily="Arial Black" fontSize="32" className="font-display">Talent</text>
        <text x="120" y="40" fill="#00FFD1" fontFamily="Arial Black" fontSize="32" className="font-display">X</text>
      </svg>
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-bcg-mint to-transparent"></div>
    </div>
  );
};

export default TalentXLogo; 