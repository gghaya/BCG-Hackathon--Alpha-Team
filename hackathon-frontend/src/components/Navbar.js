import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa';
import BCGXLogo from './BCGXLogo';

const Navbar = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationPhase, setAnimationPhase] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check if we're in demo mode
  useEffect(() => {
    setIsDemoMode(location.pathname.startsWith('/demo'));
  }, [location]);

  // Track mouse movement for enhanced parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation cycle effect with wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
      setWavePhase(prev => (prev + 0.1) % (2 * Math.PI));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-[#0A0F1C] shadow-[0_0_50px_rgba(0,255,170,0.1)] fixed top-0 left-[20%] right-0 z-50 transition-all duration-700 ease-in-out overflow-hidden">
      {/* Enhanced animated background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C] via-[#141B2D] to-[#0A0F1C] opacity-80"
        style={{
          transform: `scale(${1 + animationPhase * 0.02})`,
          transition: 'transform 5s ease-in-out'
        }}
      ></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Dynamic gradient orbs */}
        <div 
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-bcg-mint/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(${1 + animationPhase * 0.1})`,
            opacity: 0.15,
            boxShadow: '0 0 100px rgba(0, 255, 170, 0.2)'
          }}
        ></div>
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-bcg-mint/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px) scale(${1 + animationPhase * 0.1})`,
            opacity: 0.15,
            boxShadow: '0 0 100px rgba(0, 255, 170, 0.2)'
          }}
        ></div>
      </div>

      <div className="px-6 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo - Mobile Only */}
          <div className="lg:hidden">
            <div 
              className="transition-all duration-700 hover:scale-105 relative"
              onMouseEnter={() => setHoveredElement('mobileLogo')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <BCGXLogo className={`h-10 w-auto transition-all duration-500 ${hoveredElement === 'mobileLogo' ? 'drop-shadow-[0_0_12px_rgba(0,255,170,0.7)]' : ''}`} />
              <div className={`absolute inset-0 bg-bcg-mint/5 blur-xl transition-opacity duration-500 ${hoveredElement === 'mobileLogo' ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div 
                className={`relative transition-all duration-500 transform ${
                  searchFocused ? 'scale-105' : ''
                }`}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg pl-10 pr-4 py-2.5 
                    border border-bcg-mint/10 focus:border-bcg-mint/30
                    focus:outline-none focus:ring-2 focus:ring-bcg-mint/20 
                    transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,170,0.1)]
                    focus:shadow-[0_0_30px_rgba(0,255,170,0.2)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  searchFocused ? 'text-bcg-mint' : 'text-white/50'
                }`} />
              </div>
            </form>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-6">
            <button 
              className="relative group"
              onMouseEnter={() => setHoveredElement('bell')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <FaBell className={`h-5 w-5 transition-all duration-300 transform group-hover:scale-110 ${
                hoveredElement === 'bell' ? 'text-bcg-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.7)]' : 'text-white/70'
              }`} />
              <div className={`absolute inset-0 bg-bcg-mint/5 blur-xl transition-opacity duration-500 ${hoveredElement === 'bell' ? 'opacity-100' : 'opacity-0'}`}></div>
            </button>
            
            <div 
              className="flex items-center space-x-3 group cursor-pointer"
              onMouseEnter={() => setHoveredElement('profile')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className="relative">
                <FaUserCircle className={`h-8 w-8 transition-all duration-300 transform group-hover:scale-110 ${
                  hoveredElement === 'profile' ? 'text-bcg-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.7)]' : 'text-white/70'
                }`} />
                <div className={`absolute inset-0 bg-bcg-mint/5 blur-xl transition-opacity duration-500 ${hoveredElement === 'profile' ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
              <span className={`text-sm font-medium hidden md:block transition-colors duration-300 ${
                hoveredElement === 'profile' ? 'text-bcg-mint' : 'text-white/70'
              }`}>
                User
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
