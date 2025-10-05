import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JoinPage from './pages/JoinPage';
import MythsPage from './pages/MythsPage';
import NewsPage from './pages/NewsPage';
import AdminPage from './pages/AdminPage';
import LearningCenterPage from './pages/LearningCenterPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Set RTL as default
  useEffect(() => {
    document.dir = 'rtl';
    document.lang = 'he';
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'join':
        return <JoinPage />;
      case 'myths':
        return <MythsPage />;
      case 'news':
        return <NewsPage />;
      case 'admin':
        return <AdminPage />;
      case 'learning':
        return <LearningCenterPage />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen" dir="rtl">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className="flex-grow">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;