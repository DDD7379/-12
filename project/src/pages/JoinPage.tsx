import React, { useState } from 'react';
import { Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Member } from '../types';
import { supabase } from '../lib/supabase';

const JoinPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [formData, setFormData] = useState<Partial<Member>>({
    discordHandle: '',
    robloxUsername: '',
    robloxProfileLink: '',
    age: undefined,
    country: '',
    timezone: '',
    email: '',
    languages: '',
    motivation: '',
    scenario1: '',
    scenario2: '',
    weeklyAvailability: '',
    acceptedConduct: false,
    guardianConsent: false,
    projectLinks: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.discordHandle?.trim()) {
      newErrors.discordHandle = t('form.required');
    }

    if (!formData.robloxUsername?.trim()) {
      newErrors.robloxUsername = t('form.required');
    }

    if (!formData.robloxProfileLink?.trim()) {
      newErrors.robloxProfileLink = t('form.required');
    } else if (!formData.robloxProfileLink.includes('roblox.com')) {
      newErrors.robloxProfileLink = isRTL ? 'קישור לא תקין' : 'Invalid link';
    }

    if (!formData.age || formData.age < 13 || formData.age > 99) {
      newErrors.age = isRTL ? 'גיל חייב להיות בין 13-99' : 'Age must be between 13-99';
    }

    if (!formData.country?.trim()) {
      newErrors.country = t('form.required');
    }

    if (!formData.timezone?.trim()) {
      newErrors.timezone = t('form.required');
    }

    if (!formData.email?.trim()) {
      newErrors.email = t('form.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isRTL ? 'כתובת אימייל לא תקינה' : 'Invalid email address';
    }

    if (!formData.languages?.trim()) {
      newErrors.languages = t('form.required');
    }

    if (!formData.motivation?.trim() || formData.motivation.length < 50) {
      newErrors.motivation = isRTL ? 'נדרש לפחות 50 תווים' : 'At least 50 characters required';
    }

    if (!formData.scenario1?.trim() || formData.scenario1.length < 30) {
      newErrors.scenario1 = isRTL ? 'נדרש לפחות 30 תווים' : 'At least 30 characters required';
    }

    if (!formData.scenario2?.trim() || formData.scenario2.length < 30) {
      newErrors.scenario2 = isRTL ? 'נדרש לפחות 30 תווים' : 'At least 30 characters required';
    }

    if (!formData.weeklyAvailability?.trim()) {
      newErrors.weeklyAvailability = t('form.required');
    }

    if (!formData.acceptedConduct) {
      newErrors.acceptedConduct = t('form.required');
    }

    if (formData.age && formData.age < 16 && !formData.guardianConsent) {
      newErrors.guardianConsent = t('form.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to localStorage for admin panel
      const applicationData = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const existingApplications = JSON.parse(localStorage.getItem('ian_admin_applications') || '[]');
      const updatedApplications = [applicationData, ...existingApplications];
      localStorage.setItem('ian_admin_applications', JSON.stringify(updatedApplications));

      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('applications')
        .insert({
          discord_handle: formData.discordHandle || '',
          roblox_username: formData.robloxUsername || '',
          roblox_profile_link: formData.robloxProfileLink || '',
          age: formData.age || 0,
          country: formData.country || '',
          timezone: formData.timezone || '',
          email: formData.email || '',
          languages: formData.languages || '',
          motivation: formData.motivation || '',
          scenario1: formData.scenario1 || '',
          scenario2: formData.scenario2 || '',
          weekly_availability: formData.weeklyAvailability || '',
          accepted_conduct: formData.acceptedConduct || false,
          guardian_consent: formData.guardianConsent,
          project_links: formData.projectLinks,
          status: 'pending'
        });

      if (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError);
      }

      // Send to Discord webhook
      await fetch("https://discord.com/api/webhooks/1418727047127371776/xKjUUA4YGh5TDwowlavlpCHN_lMJaf8yRsHZxFxuRyWBov6oS4rwi6nWdFgXNU7Ih1OK", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "בקשה חדשה להצטרפות",
              color: 3447003,
              fields: [
                { name: "דיסקורד", value: formData.discordHandle || "לא צוין", inline: true },
                { name: "שם ברובלוקס", value: formData.robloxUsername || "לא צוין", inline: true },
                { name: "קישור לפרופיל", value: formData.robloxProfileLink || "לא צוין" },
                { name: "גיל", value: formData.age?.toString() || "לא צוין", inline: true },
                { name: "מדינה", value: formData.country || "לא צוין", inline: true },
                { name: "אזור זמן", value: formData.timezone || "לא צוין", inline: true },
                { name: "אימייל", value: formData.email || "לא צוין" },
                { name: "שפות", value: formData.languages || "לא צוין" },
                { name: "מדוע אתם רוצים להצטרף לקהילה?", value: formData.motivation || "לא נכתב" },
                { name: "איך הייתם מגיבים לפישינג שמפיץ מידע שקרי על ישראל?", value: formData.scenario1 || "לא נכתב" },
                { name: "איך הייתם מתמודדים עם הפרעה אישית במשחק?", value: formData.scenario2 || "לא נכתב" },
                { name: "זמינות שבועית", value: formData.weeklyAvailability || "לא צוין" },
                { name: "קישורי פרויקטים (אופציונלי)", value: formData.projectLinks || "אין" }
              ],
              footer: { text: "הטופס נשלח דרך האתר" }
            }
          ]
        })
      });

      setSubmitStatus("success");
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }


  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {t('form.success')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('form.successMessage')}
            </p>
            <button 
              onClick={() => setSubmitStatus('idle')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isRTL ? 'שלח בקשה נוספת' : 'Submit Another Application'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-6">
            {t('join.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('join.subtitle')}
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Discord Handle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'שם משתמש בדיסקורד' : 'Discord Username'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.discordHandle || ''}
                  onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.discordHandle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isRTL ? 'yourDiscordUserName' : 'yourDiscordUserName'}
                />
                {errors.discordHandle && (
                  <p className="text-red-500 text-sm mt-1">{errors.discordHandle}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Roblox Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.roblox')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.robloxUsername || ''}
                    onChange={(e) => setFormData({ ...formData, robloxUsername: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.robloxUsername ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="YourUsername"
                  />
                  {errors.robloxUsername && (
                    <p className="text-red-500 text-sm mt-1">{errors.robloxUsername}</p>
                  )}
                </div>

                {/* Roblox Profile Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.robloxLink')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.robloxProfileLink || ''}
                    onChange={(e) => setFormData({ ...formData, robloxProfileLink: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.robloxProfileLink ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://www.roblox.com/users/..."
                  />
                  {errors.robloxProfileLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.robloxProfileLink}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.age')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="13"
                    max="99"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="18"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.country')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isRTL ? 'ישראל' : 'Israel'}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.timezone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.timezone || ''}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.timezone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="GMT+2 / UTC+2"
                  />
                  {errors.timezone && (
                    <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.languages')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.languages || ''}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.languages ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isRTL ? 'עברית, אנגלית, ערבית...' : 'Hebrew, English, Arabic...'}
                />
                {errors.languages && (
                  <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
                )}
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.motivation')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.motivation || ''}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.motivation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isRTL 
                    ? 'ספרו לנו למה אתם רוצים להצטרף לקהילה שלנו... (לפחות 50 תווים)'
                    : 'Tell us why you want to join our community... (at least 50 characters)'
                  }
                />
                {errors.motivation && (
                  <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>
                )}
              </div>

              {/* Scenario Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.scenario1')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.scenario1 || ''}
                  onChange={(e) => setFormData({ ...formData, scenario1: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.scenario1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isRTL 
                    ? 'תארו את התגובה שלכם... (לפחות 30 תווים)'
                    : 'Describe your response... (at least 30 characters)'
                  }
                />
                {errors.scenario1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.scenario1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.scenario2')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.scenario2 || ''}
                  onChange={(e) => setFormData({ ...formData, scenario2: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.scenario2 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isRTL 
                    ? 'תארו את התגובה שלכם... (לפחות 30 תווים)'
                    : 'Describe your response... (at least 30 characters)'
                  }
                />
                {errors.scenario2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.scenario2}</p>
                )}
              </div>

              {/* Weekly Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.availability')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.weeklyAvailability || ''}
                  onChange={(e) => setFormData({ ...formData, weeklyAvailability: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.weeklyAvailability ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isRTL ? '5-10 שעות בשבוע, בעיקר בערבים' : '5-10 hours per week, mostly evenings'}
                />
                {errors.weeklyAvailability && (
                  <p className="text-red-500 text-sm mt-1">{errors.weeklyAvailability}</p>
                )}
              </div>

              {/* Project Links (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.projects')}
                </label>
                <textarea
                  rows={2}
                  value={formData.projectLinks || ''}
                  onChange={(e) => setFormData({ ...formData, projectLinks: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={isRTL 
                    ? 'קישורים לפרויקטים, יצירות או עבודות קודמות...'
                    : 'Links to projects, creations, or previous work...'
                  }
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="conduct"
                    checked={formData.acceptedConduct || false}
                    onChange={(e) => setFormData({ ...formData, acceptedConduct: e.target.checked })}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="conduct" className={`${isRTL ? 'me-3' : 'ms-3'} text-sm text-gray-700`}>
                    {t('form.conduct')} <span className="text-red-500">*</span>
                  </label>
                </div>
                {errors.acceptedConduct && (
                  <p className="text-red-500 text-sm">{errors.acceptedConduct}</p>
                )}

                {formData.age && formData.age < 16 && (
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="guardian"
                      checked={formData.guardianConsent || false}
                      onChange={(e) => setFormData({ ...formData, guardianConsent: e.target.checked })}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="guardian" className={`${isRTL ? 'me-3' : 'ms-3'} text-sm text-gray-700`}>
                      {t('form.guardian')} <span className="text-red-500">*</span>
                    </label>
                  </div>
                )}
                {errors.guardianConsent && (
                  <p className="text-red-500 text-sm">{errors.guardianConsent}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isRTL ? 'שולח...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      {t('form.submit')}
                    </>
                  )}
                </button>
              </div>

              {submitStatus === 'error' && (
                <div className="flex items-center justify-center text-red-600 gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    {isRTL 
                      ? 'אירעה שגיאה. אנא נסו שוב.'
                      : 'An error occurred. Please try again.'
                    }
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinPage;