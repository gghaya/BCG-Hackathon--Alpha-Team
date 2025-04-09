import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import BCGXLogo from './BCGXLogo';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeField, setActiveField] = useState(null);
  const [formFocused, setFormFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [particleCount, setParticleCount] = useState(20);
  const [wavePhase, setWavePhase] = useState(0);

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

  // Dynamic particle count based on form focus
  useEffect(() => {
    setParticleCount(formFocused ? 30 : 20);
  }, [formFocused]);

  // Check form validity
  useEffect(() => {
    setFormValid(username.length > 0 && password.length > 0);
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setActiveField(field);
    setFormFocused(true);
  };

  const handleBlur = () => {
    setActiveField(null);
    setFormFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-screen flex bg-gradient-to-br from-bcg-black via-bcg-gray-800 to-bcg-black relative overflow-hidden">
      {/* Enhanced animated background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-bcg-mint/5 via-transparent to-bcg-mint/5 transition-all duration-10000"
        style={{ 
          transform: `scale(${1 + animationPhase * 0.05}) rotate(${animationPhase * 5}deg)`,
          opacity: 0.3 + (animationPhase * 0.1),
          background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(0, 255, 170, 0.1) 0%, transparent 50%)`
        }}
      ></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Dynamic gradient orbs */}
        <div 
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-bcg-mint/5 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(${1 + animationPhase * 0.05})`,
            opacity: formFocused ? 0.7 : 0.5,
            boxShadow: `0 0 ${20 + animationPhase * 5}px rgba(0, 255, 170, 0.2)`
          }}
        ></div>
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-bcg-mint/5 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px) scale(${1 + animationPhase * 0.05})`,
            opacity: formFocused ? 0.7 : 0.5,
            boxShadow: `0 0 ${20 + animationPhase * 5}px rgba(0, 255, 170, 0.2)`
          }}
        ></div>
        
        {/* Wave effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0, 255, 170, 0.1) 10px,
              rgba(0, 255, 170, 0.1) 20px
            )`,
            transform: `translateY(${Math.sin(wavePhase) * 20}px)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        ></div>

        {/* Dynamic particles */}
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `rgba(0, 255, 170, ${0.1 + Math.random() * 0.2})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(${mousePosition.x * (0.1 + Math.random() * 0.2)}px, ${mousePosition.y * (0.1 + Math.random() * 0.2)}px)`
            }}
          ></div>
        ))}

        {/* Animated geometric shapes */}
        <div 
          className="absolute right-1/4 bottom-1/4 w-32 h-32 border border-bcg-mint/20 rounded-full transform transition-all duration-1000"
          style={{ 
            transform: `rotate(${formFocused ? -60 : -45 + animationPhase * 10}deg) scale(${1 + Math.sin(wavePhase) * 0.1})`,
            opacity: formFocused ? 0.3 : 0.2,
            boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.1)`
          }}
        ></div>
        <div 
          className="absolute left-1/3 bottom-1/3 w-24 h-24 border border-bcg-mint/20 transform transition-all duration-1000"
          style={{ 
            transform: `rotate(${formFocused ? 24 : 12 + animationPhase * 15}deg) scale(${1 + Math.cos(wavePhase) * 0.1})`,
            opacity: formFocused ? 0.3 : 0.2,
            boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.1)`
          }}
        ></div>
        <div 
          className="absolute right-1/3 top-1/3 w-24 h-24 border border-bcg-mint/20 transform transition-all duration-1000"
          style={{ 
            transform: `rotate(${formFocused ? -24 : -12 - animationPhase * 15}deg) scale(${1 + Math.sin(wavePhase) * 0.1})`,
            opacity: formFocused ? 0.3 : 0.2,
            boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.1)`
          }}
        ></div>

        {/* Enhanced grid pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,bcg-mint/5_1px,transparent_1px),linear-gradient(to_bottom,bcg-mint/5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] transition-all duration-1000"
          style={{ 
            opacity: formFocused ? 0.3 : 0.1,
            transform: `scale(${1 + animationPhase * 0.02}) rotate(${Math.sin(wavePhase) * 2}deg)`,
            backgroundSize: `${4 + Math.sin(wavePhase) * 0.5}rem ${4 + Math.sin(wavePhase) * 0.5}rem`
          }}
        ></div>

        {/* Animated lines with glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bcg-mint/20 to-transparent animate-shimmer"
            style={{
              boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.2)`,
              transform: `translateY(${Math.sin(wavePhase) * 5}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bcg-mint/20 to-transparent animate-shimmer"
            style={{
              boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.2)`,
              transform: `translateY(${Math.sin(wavePhase + Math.PI) * 5}px)`,
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-bcg-mint/20 to-transparent animate-shimmer"
            style={{
              boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.2)`,
              transform: `translateX(${Math.cos(wavePhase) * 5}px)`,
              animationDelay: '2s'
            }}
          ></div>
          <div 
            className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-bcg-mint/20 to-transparent animate-shimmer"
            style={{
              boxShadow: `0 0 ${10 + animationPhase * 2}px rgba(0, 255, 170, 0.2)`,
              transform: `translateX(${Math.cos(wavePhase + Math.PI) * 5}px)`,
              animationDelay: '3s'
            }}
          ></div>
        </div>

        {/* Animated circles with pulse effect */}
        <div 
          className="absolute top-1/4 right-1/4 w-40 h-40 border border-bcg-mint/10 rounded-full transition-all duration-5000"
          style={{ 
            transform: `scale(${0.8 + animationPhase * 0.1})`,
            opacity: 0.1 + (animationPhase * 0.05),
            boxShadow: `0 0 ${20 + animationPhase * 5}px rgba(0, 255, 170, 0.1)`,
            animation: 'pulse 4s infinite'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-60 h-60 border border-bcg-mint/10 rounded-full transition-all duration-5000"
          style={{ 
            transform: `scale(${0.7 + animationPhase * 0.15})`,
            opacity: 0.05 + (animationPhase * 0.05),
            boxShadow: `0 0 ${20 + animationPhase * 5}px rgba(0, 255, 170, 0.1)`,
            animation: 'pulse 4s infinite 1s'
          }}
        ></div>

        {/* Animated dots with glow effect */}
        <div 
          className="absolute top-1/3 left-1/3 w-1 h-1 bg-bcg-mint/30 rounded-full animate-pulse"
          style={{ 
            animationDuration: '3s',
            boxShadow: `0 0 ${5 + animationPhase}px rgba(0, 255, 170, 0.3)`,
            transform: `translate(${Math.sin(wavePhase) * 10}px, ${Math.cos(wavePhase) * 10}px)`
          }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/3 w-1 h-1 bg-bcg-mint/30 rounded-full animate-pulse"
          style={{ 
            animationDuration: '4s',
            animationDelay: '1s',
            boxShadow: `0 0 ${5 + animationPhase}px rgba(0, 255, 170, 0.3)`,
            transform: `translate(${Math.cos(wavePhase) * 10}px, ${Math.sin(wavePhase) * 10}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-bcg-mint/30 rounded-full animate-pulse"
          style={{ 
            animationDuration: '5s',
            animationDelay: '2s',
            boxShadow: `0 0 ${5 + animationPhase}px rgba(0, 255, 170, 0.3)`,
            transform: `translate(${Math.sin(wavePhase + Math.PI/2) * 10}px, ${Math.cos(wavePhase + Math.PI/2) * 10}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/4 right-2/3 w-1 h-1 bg-bcg-mint/30 rounded-full animate-pulse"
          style={{ 
            animationDuration: '6s',
            animationDelay: '3s',
            boxShadow: `0 0 ${5 + animationPhase}px rgba(0, 255, 170, 0.3)`,
            transform: `translate(${Math.cos(wavePhase + Math.PI/2) * 10}px, ${Math.sin(wavePhase + Math.PI/2) * 10}px)`
          }}
        ></div>
      </div>

      {/* Left Section - Welcome Message */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-bcg-black/50 backdrop-blur-sm relative z-10 transition-transform duration-700"
        style={{ transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` }}
      >
        <div className="max-w-lg space-y-8">
          <div className="flex justify-center">
            <div 
              className="transition-transform duration-700 hover:scale-105"
              onMouseEnter={() => setHoveredElement('logo')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <BCGXLogo className={`h-20 w-auto transition-all duration-500 ${hoveredElement === 'logo' ? 'drop-shadow-[0_0_8px_rgba(0,255,170,0.5)]' : ''}`} />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-display font-bold text-white transition-all duration-500">
              Welcome to BCGX Talent Portal
            </h1>
            <p className="text-xl text-bcg-gray-300 transition-all duration-500">
              Your gateway to connecting with exceptional talent and opportunities at BCGX.
            </p>
            <div className="space-y-4 text-bcg-gray-300">
              <p 
                className="transition-all duration-500 hover:text-bcg-mint hover:translate-x-2 flex items-center"
                onMouseEnter={() => setHoveredElement('feature1')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-500 ${hoveredElement === 'feature1' ? 'bg-bcg-mint scale-150' : 'bg-bcg-gray-600'}`}></span>
                Access your personalized dashboard
              </p>
              <p 
                className="transition-all duration-500 hover:text-bcg-mint hover:translate-x-2 flex items-center"
                onMouseEnter={() => setHoveredElement('feature2')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-500 ${hoveredElement === 'feature2' ? 'bg-bcg-mint scale-150' : 'bg-bcg-gray-600'}`}></span>
                Manage job applications and candidates
              </p>
              <p 
                className="transition-all duration-500 hover:text-bcg-mint hover:translate-x-2 flex items-center"
                onMouseEnter={() => setHoveredElement('feature3')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-500 ${hoveredElement === 'feature3' ? 'bg-bcg-mint scale-150' : 'bg-bcg-gray-600'}`}></span>
                Track recruitment progress
              </p>
              <p 
                className="transition-all duration-500 hover:text-bcg-mint hover:translate-x-2 flex items-center"
                onMouseEnter={() => setHoveredElement('feature4')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-500 ${hoveredElement === 'feature4' ? 'bg-bcg-mint scale-150' : 'bg-bcg-gray-600'}`}></span>
                Connect with potential candidates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20 transition-transform duration-700"
        style={{ transform: `translate(${mousePosition.x * -0.05}px, ${mousePosition.y * -0.05}px)` }}
      >
        <div 
          className={`w-full max-w-md space-y-8 backdrop-blur-lg rounded-2xl p-8 shadow-card animate-fade-in transition-all duration-700 ${
            formFocused ? 'bg-white/20' : 'bg-white/10'
          }`}
        >
          <div>
            <div className="flex justify-center lg:hidden">
              <div 
                className="transition-transform duration-700 hover:scale-105"
                onMouseEnter={() => setHoveredElement('mobileLogo')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <BCGXLogo className={`h-16 w-auto transition-all duration-500 ${hoveredElement === 'mobileLogo' ? 'drop-shadow-[0_0_8px_rgba(0,255,170,0.5)]' : ''}`} />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-display font-bold text-white transition-all duration-500">
              Sign in to your account
          </h2>
            <p className="mt-2 text-center text-sm text-bcg-gray-300 transition-all duration-500">
            Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-bcg-mint hover:text-bcg-mint-light transition-colors duration-300 hover:underline"
                onMouseEnter={() => setHoveredElement('registerLink')}
                onMouseLeave={() => setHoveredElement(null)}
              >
              Create one now
            </Link>
          </p>
        </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
                <label 
                  htmlFor="username" 
                  className={`block text-sm font-medium mb-1 transition-all duration-300 ${
                    activeField === 'username' ? 'text-bcg-mint' : 'text-bcg-gray-300'
                  }`}
                >
                Username
              </label>
                <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                    className={`appearance-none block w-full px-4 py-3 border placeholder-bcg-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-300 ease-in-out text-sm ${
                      activeField === 'username' 
                        ? 'border-bcg-mint bg-bcg-gray-800/70' 
                        : 'border-bcg-gray-600 bg-bcg-gray-800/50'
                    }`}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => handleFocus('username')}
                    onBlur={handleBlur}
                  />
                  {username.length > 0 && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${username.length > 3 ? 'bg-bcg-mint' : 'bg-bcg-gray-600'}`}></div>
                    </div>
                  )}
                </div>
            </div>

            <div>
                <label 
                  htmlFor="password" 
                  className={`block text-sm font-medium mb-1 transition-all duration-300 ${
                    activeField === 'password' ? 'text-bcg-mint' : 'text-bcg-gray-300'
                  }`}
                >
                Password
              </label>
                <div className="relative">
              <input
                id="password"
                name="password"
                    type={showPassword ? "text" : "password"}
                required
                    className={`appearance-none block w-full px-4 py-3 border placeholder-bcg-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-bcg-mint focus:border-transparent transition-all duration-300 ease-in-out text-sm ${
                      activeField === 'password' 
                        ? 'border-bcg-mint bg-bcg-gray-800/70' 
                        : 'border-bcg-gray-600 bg-bcg-gray-800/50'
                    }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bcg-gray-400 hover:text-bcg-mint transition-colors duration-300"
                      onClick={togglePasswordVisibility}
                      onMouseEnter={() => setHoveredElement('togglePassword')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

            <button
              type="submit"
              disabled={loading || !formValid}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-bcg-black bg-bcg-mint hover:bg-bcg-mint-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bcg-mint transition-all duration-300 ease-in-out z-50 ${
                loading ? 'opacity-70 cursor-not-allowed' : !formValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredElement('submitButton')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bcg-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  {formValid && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </span>
              )}
            </button>
          </form>
          </div>
      </div>
    </div>
  );
};

export default Login;