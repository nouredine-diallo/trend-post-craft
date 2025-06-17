
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from '../components/auth/Login';
import Dashboard from '../components/dashboard/Dashboard';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

const Index = () => {
  const [user, setUser] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('contentland_user');
    const savedOnboarding = localStorage.getItem('contentland_onboarding');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setHasCompletedOnboarding(savedOnboarding === 'true');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('contentland_user', JSON.stringify(userData));
  };

  const handleOnboardingComplete = (data) => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('contentland_onboarding', 'true');
    localStorage.setItem('contentland_niche', data.niche);
  };

  const handleLogout = () => {
    setUser(null);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('contentland_user');
    localStorage.removeItem('contentland_onboarding');
    localStorage.removeItem('contentland_niche');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
