import React, { useState } from 'react';
import { Star, Users, Shield, BookOpen, ArrowRight, Play, ExternalLink, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DISCORD_INVITE_URL } from '../types';
import { supabase } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [contactForm, setContactForm] = useState({
    discordUsername: '',
    robloxUsername: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDiscordClick = () => {
    window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to localStorage for admin panel
      const contactData = {
        id: Date.now().toString(),
        name: contactForm.discordUsername,
        email: contactForm.email,
        subject: `Contact from ${contactForm.discordUsername}`,
        message: `Discord: ${contactForm.discordUsername}\nRoblox: ${contactForm.robloxUsername}\n\nMessage: ${contactForm.message}`,
        createdAt: new Date().toISOString()
      };
      
      const existingContacts = JSON.parse(localStorage.getItem('ian_admin_contacts') || '[]');
      const updatedContacts = [contactData, ...existingContacts];
      localStorage.setItem('ian_admin_contacts', JSON.stringify(updatedContacts));

      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('contacts')
        .insert({
          name: contactForm.discordUsername,
          email: contactForm.email,
          subject: `Contact from ${contactForm.discordUsername}`,
          message: `Discord: ${contactForm.discordUsername}\nRoblox: ${contactForm.robloxUsername}\n\nMessage: ${contactForm.message}`
        });

      if (supabaseError) {
        console.error('Error saving contact to Supabase:', supabaseError);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setContactForm({ discordUsername: '', robloxUsername: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white page-enter">
{/* Hero Section */}
<section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-800/30"></div>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-800/40 to-blue-700/60"></div>
  
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
    <div className="text-center">
      <div className="fade-in">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight slide-up">
          {t('home.title')}
        </h1>
        <p className="text-xl text-blue-100 mb-12 leading-relaxed slide-up stagger-1 max-w-3xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 slide-up stagger-2 justify-center">
          <button 
            onClick={() => onNavigate('join')}
            className="bg-white text-blue-600 px-10 py-5 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center group btn-animate card-hover pulse-gentle"
          >
            {t('home.joinUs')}
            <ArrowRight className={`${isRTL ? 'me-2 rotate-180' : 'ms-2'} h-5 w-5 group-hover:translate-x-1 transition-transform`} />
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className="border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 btn-animate card-hover"
          >
            {t('home.learnMore')}
          </button>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Mission Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              {isRTL ? 'המשימה שלנו' : 'Our Mission'}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('home.mission')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('home.problem')}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-6">
                {isRTL ? 'איך אנחנו עוזרים' : 'How We Help'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className={`h-6 w-6 text-blue-600 ${isRTL ? 'ms-3' : 'me-3'} mt-1 shrink-0`} />
                  <span className="text-gray-700">
                    {isRTL 
                      ? 'מגנים על שחקנים מפני הטרדות ואפליה'
                      : 'Protecting players from harassment and discrimination'
                    }
                  </span>
                </div>
                <div className="flex items-start">
                  <BookOpen className={`h-6 w-6 text-blue-600 ${isRTL ? 'ms-3' : 'me-3'} mt-1 shrink-0`} />
                  <span className="text-gray-700">
                    {isRTL 
                      ? 'מספקים מידע מדויק וחינוכי על ישראל'
                      : 'Providing accurate and educational information about Israel'
                    }
                  </span>
                </div>
                <div className="flex items-start">
                  <Users className={`h-6 w-6 text-blue-600 ${isRTL ? 'ms-3' : 'me-3'} mt-1 shrink-0`} />
                  <span className="text-gray-700">
                    {isRTL 
                      ? 'בונים קהילה חזקה ותומכת'
                      : 'Building a strong and supportive community'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              {isRTL ? 'מה אנחנו מציעים' : 'What We Offer'}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-blue-100 rounded-xl hover:shadow-lg transition-shadow card-hover fade-in stagger-1">
              <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                {isRTL ? 'חינוך ומידע' : 'Education & Information'}
              </h3>
              <p className="text-gray-600">
                {isRTL 
                  ? 'מידע מדויק, מאמרים וסרטונים לחינוך הקהילה'
                  : 'Accurate information, articles and videos for community education'
                }
              </p>
            </div>
            
            <div className="text-center p-6 border border-blue-100 rounded-xl hover:shadow-lg transition-shadow card-hover fade-in stagger-1">
              <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                {isRTL ? 'קהילה תומכת' : 'Supportive Community'}
              </h3>
              <p className="text-gray-600">
                {isRTL 
                  ? 'מרחב בטוח לשחקנים ישראלים ויהודים'
                  : 'Safe space for Israeli and Jewish players'
                }
              </p>
            </div>
            
            <div className="text-center p-6 border border-blue-100 rounded-xl hover:shadow-lg transition-shadow card-hover fade-in stagger-1">
              <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                {isRTL ? 'הגנה מפני שנאה' : 'Protection Against Hate'}
              </h3>
              <p className="text-gray-600">
                {isRTL 
                  ? 'נלחמים בחדשות מזויפות ובהטרדות'
                  : 'Fighting misinformation and harassment'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isRTL ? 'צרו קשר איתנו' : 'Get in Touch'}
            </h2>
            <p className="text-lg text-gray-600">
              {isRTL 
                ? 'יש לכם שאלות, הצעות או רוצים לדווח על בעיה? אנחנו כאן כדי לעזור'
                : 'Have questions, suggestions, or want to report an issue? We\'re here to help'
              }
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 me-3" />
              <p className="text-green-800">
                {isRTL ? 'ההודעה נשלחה בהצלחה! נחזור אליכם בקרוב.' : 'Message sent successfully! We\'ll get back to you soon.'}
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 me-3" />
              <p className="text-red-800">
                {isRTL ? 'אירעה שגיאה בשליחת ההודעה. נסו שוב.' : 'An error occurred sending the message. Please try again.'}
              </p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'שם משתמש בדיסקורד' : 'Discord Username'}
                </label>
                <input
                  type="text"
                  value={contactForm.discordUsername}
                  onChange={(e) => setContactForm({ ...contactForm, discordUsername: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isRTL ? 'yourDiscordUserName' : 'yourDiscordUserName'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'שם משתמש ברובלוקס' : 'Roblox Username'}
                </label>
                <input
                  type="text"
                  value={contactForm.robloxUsername}
                  onChange={(e) => setContactForm({ ...contactForm, robloxUsername: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isRTL ? 'RobloxUsername' : 'RobloxUsername'}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'כתובת אימייל' : 'Email Address'}
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={isRTL ? 'your@email.com' : 'your@email.com'}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'הודעה' : 'Message'}
              </label>
              <textarea
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={isRTL ? 'כתבו כאן את ההודעה שלכם...' : 'Write your message here...'}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isRTL ? 'שולח...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {isRTL ? 'שלח הודעה' : 'Send Message'}
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/80"></div>
        
        <div className="relative">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">
              {isRTL ? 'מוכנים להצטרף?' : 'Ready to Join?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {isRTL
                ? 'הצטרפו לקהילה שלנו וחברו לקרב נגד חדשות מזויפות'
                : 'Join our community and help us fight misinformation'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              {/* כפתור הצטרפות */}
              <button
                onClick={() => onNavigate('join')}
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.joinUs')}
              </button>
              
              {/* כפתור דיסקורד */}
              <button
                onClick={handleDiscordClick}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Play className="h-5 w-5" />
                {t('home.discord')}
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>  
          </div>   
        </div>    
      </section>
    </div>      
  );
};

export default HomePage;