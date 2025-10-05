import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

const ContactPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    robloxUsername: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          roblox_username: formData.robloxUsername || null,
          subject: formData.subject,
          message: formData.message
        });

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', robloxUsername: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-6">
            {currentLanguage.code === 'he' ? 'צור קשר' : 'Contact Us'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {currentLanguage.code === 'he' 
              ? 'יש לכם שאלות, הצעות או רוצים לדווח על בעיה? אנחנו כאן כדי לעזור'
              : 'Have questions, suggestions, or want to report an issue? We\'re here to help'
            }
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-blue-800 mb-6">
                {currentLanguage.code === 'he' ? 'פרטי קשר' : 'Contact Information'}
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Mail className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-blue-800">
                      {currentLanguage.code === 'he' ? 'אימייל רשמי' : 'Official Email'}
                    </h3>
                  </div>
                  <p className="text-gray-700">daniel.services7379@gmail.com
</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-green-800">Discord</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {currentLanguage.code === 'he' 
                      ? 'הצטרפו לשרת הדיסקורד שלנו לתמיכה מהירה'
                      : 'Join our Discord server for quick support'
                    }
                  </p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    {currentLanguage.code === 'he' ? 'הצטרפו לדיסקורד' : 'Join Discord'}
                  </button>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                    {currentLanguage.code === 'he' ? 'זמני תגובה' : 'Response Times'}
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>
                      {currentLanguage.code === 'he' ? '• אימייל: 24-48 שעות' : '• Email: 24-48 hours'}
                    </li>
                    <li>
                      {currentLanguage.code === 'he' ? '• דיסקורד: מיידי' : '• Discord: Immediate'}
                    </li>
                    <li>
                      {currentLanguage.code === 'he' ? '• דיווח דחוף: תוך מספר שעות' : '• Urgent reports: Within hours'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-6">
                  {currentLanguage.code === 'he' ? 'שלחו לנו הודעה' : 'Send us a Message'}
                </h2>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-800">
                        {currentLanguage.code === 'he' 
                          ? 'ההודעה נשלחה בהצלחה! נחזור אליכם בקרוב.'
                          : 'Message sent successfully! We will get back to you soon.'
                        }
                      </span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentLanguage.code === 'he' ? 'שם משתמש בדיסקורד' : 'Discord Username'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={currentLanguage.code === 'he' ? 'yourDiscordUserName' : 'yourDiscordUserName'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentLanguage.code === 'he' ? 'שם משתמש ברובלוקס' : 'Roblox Username'}
                      </label>
                      <input
                        type="text"
                        value={formData.robloxUsername}
                        onChange={(e) => setFormData({ ...formData, robloxUsername: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={currentLanguage.code === 'he' ? 'YourUsername' : 'YourUsername'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentLanguage.code === 'he' ? 'כתובת אימייל' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentLanguage.code === 'he' ? 'נושא' : 'Subject'} *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        {currentLanguage.code === 'he' ? 'בחרו נושא' : 'Select a subject'}
                      </option>
                      <option value="general">
                        {currentLanguage.code === 'he' ? 'שאלה כללית' : 'General Question'}
                      </option>
                      <option value="harassment">
                        {currentLanguage.code === 'he' ? 'דיווח על הטרדה' : 'Report Harassment'}
                      </option>
                      <option value="misinformation">
                        {currentLanguage.code === 'he' ? 'דיווח על חדשות מזויפות' : 'Report Misinformation'}
                      </option>
                      <option value="feedback">
                        {currentLanguage.code === 'he' ? 'משוב והצעות' : 'Feedback & Suggestions'}
                      </option>
                      <option value="partnership">
                        {currentLanguage.code === 'he' ? 'שיתוף פעולה' : 'Partnership'}
                      </option>
                      <option value="technical">
                        {currentLanguage.code === 'he' ? 'בעיה טכנית' : 'Technical Issue'}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentLanguage.code === 'he' ? 'הודעה' : 'Message'} *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={currentLanguage.code === 'he' 
                        ? 'כתבו את ההודעה שלכם כאן...'
                        : 'Write your message here...'
                      }
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {currentLanguage.code === 'he' ? 'שולח...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          {currentLanguage.code === 'he' ? 'שלח הודעה' : 'Send Message'}
                        </>
                      )}
                    </button>
                  </div>
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center justify-center text-red-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>
                        {currentLanguage.code === 'he' 
                          ? 'אירעה שגיאה. אנא נסו שוב.'
                          : 'An error occurred. Please try again.'
                        }
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;