import React, { useState } from 'react';
import { Star, Users, Shield, Heart, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DISCORD_INVITE_URL } from '../types';

const Footer: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const isRTL = currentLanguage.direction === 'rtl';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const handleDiscordClick = () => {
    window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo and Mission */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-lg me-3 shrink-0">
                <Star className="h-6 w-6 text-blue-600" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {isRTL ? 'מערך ההסברה' : 'Israeli Advocacy Network'}
                </h3>
                <p className="text-blue-200 text-sm">
                  {isRTL ? 'רובלוקס ישראל' : 'Roblox Israel'}
                </p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              {isRTL 
                ? 'בונים קהילה חיובית ונלחמים באנטישמיות ברובלוקס'
                : 'Building a positive community fighting anti-Semitism in Roblox'
              }
            </p>
          </div>

          {/* Community Stats */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isRTL ? 'הקהילה שלנו' : 'Our Community'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-300 me-3 shrink-0" />
                <span className="text-sm">
                  {isRTL ? '10+ חברים פעילים' : '500+ Active Members'}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-300 me-3 shrink-0" />
                <span className="text-sm">
                  {isRTL ? 'הגנה על הקהילה' : 'Community Protection'}
                </span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-blue-300 me-3 shrink-0" />
                <span className="text-sm">
                  {isRTL ? 'מפיצים חיוביות' : 'Spreading Positivity'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact and Subscribe */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isRTL ? 'הישארו מעודכנים' : 'Stay Updated'}
            </h4>
            
            {/* Email Subscription */}
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRTL ? 'כתובת אימייל' : 'Email address'}
                  className="flex-1 px-3 py-2 text-gray-900 rounded-lg text-sm min-w-0"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
                  disabled={subscribed}
                >
                  {subscribed ? (
                    <span className="text-xs">{t('common.success')}</span>
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
            
            {subscribed && (
              <p className="text-green-300 text-sm mb-4">{t('common.subscribeSuccess')}</p>
            )}

            {/* Discord Button */}
            <button 
              onClick={handleDiscordClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 mb-4"
            >
              <span>{isRTL ? 'הצטרפו לדיסקורד' : 'Join Discord'}</span>
              <ExternalLink className="h-4 w-4" />
            </button>

            {/* Contact Email */}
            <p className="text-blue-100 text-sm">
daniel.services7379@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-blue-200 text-sm text-center sm:text-start">
            © 2025 מערך ההסברה הישראלי ברובלוקס. {isRTL ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-blue-200 text-sm">
            </span>
            <span className="text-xl">🇮🇱</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;