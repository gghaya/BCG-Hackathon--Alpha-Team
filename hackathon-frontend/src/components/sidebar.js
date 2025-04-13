// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaBriefcase, FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import BCGXLogo from './BCGXLogo';
import authService from "../services/authService";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const handleLogout = (event) => {
    event.preventDefault();
    authService.logout();
    navigate("/login");
  };
  
  const isActive = (path) => location.pathname === path;

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

  // Animation cycle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="fixed left-0 top-0 h-screen w-1/5 bg-[#0A0F1C] shadow-[0_0_50px_rgba(0,255,170,0.1)] z-50 transition-all duration-700 ease-in-out overflow-hidden"
    >
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
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-bcg-mint/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(${1 + animationPhase * 0.1})`,
            opacity: 0.15,
            boxShadow: '0 0 100px rgba(0, 255, 170, 0.2)'
          }}
        ></div>
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-bcg-mint/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px) scale(${1 + animationPhase * 0.1})`,
            opacity: 0.15,
            boxShadow: '0 0 100px rgba(0, 255, 170, 0.2)'
          }}
        ></div>
      </div>

      <div className="flex flex-col h-full relative z-10">
        <div className="p-6 flex justify-center items-center bg-black/20 border-b border-bcg-mint/10">
          <div 
            className="transition-all duration-700 hover:scale-105 relative"
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <BCGXLogo className={`h-10 w-auto transition-all duration-500 ${hoveredItem === 'logo' ? 'drop-shadow-[0_0_12px_rgba(0,255,170,0.7)]' : ''}`} />
            <div className={`absolute inset-0 bg-bcg-mint/5 blur-xl transition-opacity duration-500 ${hoveredItem === 'logo' ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-3">
            <Link
              to="/dashboard"
              onMouseEnter={() => setHoveredItem('dashboard')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,170,0.15)] ${
                isActive('/dashboard') 
                  ? 'bg-bcg-mint/10 text-bcg-mint shadow-lg border border-bcg-mint/20 shadow-[0_0_30px_rgba(0,255,170,0.2)]' 
                  : 'text-white/70 hover:bg-bcg-mint/5 hover:text-bcg-mint'
              }`}
            >
              <FaChartLine className={`mr-3 h-6 w-6 transition-all duration-300 ${
                isActive('/dashboard') || hoveredItem === 'dashboard' ? 'text-bcg-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.7)]' : 'text-white/50 group-hover:text-bcg-mint'
              }`} />
              <span className="transition-all duration-300">Dashboard</span>
            </Link>
            
            <Link
              to="/jobs"
              onMouseEnter={() => setHoveredItem('jobs')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,170,0.15)] ${
                isActive('/jobs') 
                  ? 'bg-bcg-mint/10 text-bcg-mint shadow-lg border border-bcg-mint/20 shadow-[0_0_30px_rgba(0,255,170,0.2)]' 
                  : 'text-white/70 hover:bg-bcg-mint/5 hover:text-bcg-mint'
              }`}
            >
              <FaBriefcase className={`mr-3 h-6 w-6 transition-all duration-300 ${
                isActive('/jobs') || hoveredItem === 'jobs' ? 'text-bcg-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.7)]' : 'text-white/50 group-hover:text-bcg-mint'
              }`} />
              <span className="transition-all duration-300">Jobs</span>
            </Link>
            
            <Link
              to="/applicant"
              onMouseEnter={() => setHoveredItem('applicants')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,170,0.15)] ${
                isActive('/applicants') 
                  ? 'bg-bcg-mint/10 text-bcg-mint shadow-lg border border-bcg-mint/20 shadow-[0_0_30px_rgba(0,255,170,0.2)]' 
                  : 'text-white/70 hover:bg-bcg-mint/5 hover:text-bcg-mint'
              }`}
            >
              <FaUserTie className={`mr-3 h-6 w-6 transition-all duration-300 ${
                isActive('/applicants') || hoveredItem === 'applicants' ? 'text-bcg-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.7)]' : 'text-white/50 group-hover:text-bcg-mint'
              }`} />
              <span className="transition-all duration-300">Applicants</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex-shrink-0 p-4 border-t border-bcg-mint/10 bg-black/20">
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            className="group flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-white/70 hover:bg-bcg-mint/5 hover:text-bcg-mint hover:shadow-[0_0_20px_rgba(0,255,170,0.15)]"
          >
            <FaSignOutAlt className={`mr-3 h-6 w-6 transition-all duration-300 ${
              hoveredItem === 'logout' ? 'text-bcg-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.7)]' : 'text-white/50 group-hover:text-bcg-mint'
            }`} />
            <span className="transition-all duration-300">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}