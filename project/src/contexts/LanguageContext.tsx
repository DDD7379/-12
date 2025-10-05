import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: 'he', name: 'עברית', direction: 'rtl' },
  { code: 'en', name: 'English', direction: 'ltr' }
];

const translations: Record<string, Record<string, string>> = {
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.about': 'קצת עלינו',
    'nav.myths': 'מיתוסים מול עובדות',
    'nav.join': 'הצטרפו אלינו',
    'nav.news': 'חדשות ועדכונים',
    'nav.learning': 'מרכז הלמידה',
    
    // Homepage
    'home.title': 'מערך ההסברה הישראלית ברובלוקס',
    'home.subtitle': 'מפיצים אמת, נלחמים בחדשות מזויפות ובונים קהילה חיובית לשחקנים ישראלים ויהודים',
    'home.mission': 'המשימה שלנו היא לייצג את ישראל בצורה חיובית בקהילת הרובלוקס, לחנך שחקנים במידע עובדתי וליצור מרחב בטוח לגיימרים יהודים וישראלים.',
    'home.problem': 'אנחנו נלחמים במידע מוטעה ובשנאה המכוונת נגד שחקנים יהודים וישראלים במשחקי רובלוקס וברשתות החברתיות.',
    'home.joinUs': 'הצטרפו לקהילה',
    'home.learnMore': 'למדו עוד',
    'home.discord': 'הצטרפו לדיסקורד',
    
    // About
    'about.title': 'אודות המערך שלנו',
    'about.mission': 'הצהרת מטרה',
    'about.missionText': 'מערך ההסברה הישראלית ברובלוקס מחויבת לקדם מידע מדויק על ישראל, לתמוך בשחקנים יהודים וישראלים ולטפח דיאלוג חיובי בתוך קהילת הגיימינג.',
    'about.vision': 'החזון שלנו',
    'about.visionText': 'אנו רואים לעצמנו קהילת רובלוקס שבה שחקנים ישראלים ויהודים יכולים להשתתף בחופשיות מבלי להתמודד עם אפליה, מידע מוטעה או שנאה.',
    'about.team': 'הצוות שלנו',
    'about.teamText': 'הצוות הגיוון שלנו מורכב מגיימרים נלהבים, חינוכיים ופעילים מכל רחבי העולם, המאוחדים במחויבותנו לאמת ולבניית קהילה.',
    
    // Join Form
    'join.title': 'הצטרפו לקהילה שלנו',
    'join.subtitle': 'מלאו את הטופס הבא כדי להצטרף למערך ההסברה הישראלית ברובלוקס',
    'form.discord': 'Discord Handle + ID',
    'form.discordPlaceholder': 'yourDiscordUserName',
    'form.roblox': 'שם משתמש ברובלוקס',
    'form.robloxLink': 'קישור לפרופיל רובלוקס',
    'form.age': 'גיל',
    'form.country': 'מדינה',
    'form.timezone': 'אזור זמן',
    'form.email': 'כתובת אימייל',
    'form.languages': 'שפות (טקסט חופשי)',
    'form.motivation': 'מדוע אתם רוצים להצטרף?',
    'form.scenario1': 'איך הייתם מגיבים למישהו שמפיץ מידע שקרי על ישראל?',
    'form.scenario2': 'איך הייתם מתמודדים עם הטרדה אנטישמית במשחק?',
    'form.availability': 'זמינות שבועית (שעות)',
    'form.conduct': 'אני מסכים/ה לקוד ההתנהגות ולמדיניות הפרטיות',
    'form.guardian': 'הסכמת הורה/אפוטרופוס (מתחת לגיל 16)',
    'form.projects': 'קישורים לפרויקטים (אופציונלי)',
    'form.submit': 'שלח בקשה',
    'form.required': 'שדה חובה',
    'form.success': 'הבקשה נשלחה בהצלחה!',
    'form.successMessage': 'תודה על הבקשה להצטרפות. נבדוק את הבקשה ונחזור אליכם בקרוב.',
    
    // Myths vs Facts
    'myths.title': 'מיתוסים מול עובדות',
    'myths.subtitle': 'תיקון מידע מוטעה נפוץ על ישראל',
    'myths.myth': 'מיתוס',
    'myths.fact': 'עובדה',
    
    // News
    'news.title': 'חדשות ועדכונים',
    'news.subtitle': 'עדכונים אחרונים מהקהילה והפעילות שלנו',
    'news.readMore': 'קרא עוד',
    'news.noNews': 'אין חדשות זמינות כרגע',
    'news.filterByTag': 'סנן לפי תג',
    'news.allTags': 'כל התגים',
    
    // Admin
    'admin.title': 'לוח בקרה למנהלים',
    'admin.posts': 'ניהול פוסטים',
    'admin.members': 'ניהול חברים',
    'admin.newPost': 'פוסט חדש',
    'admin.editPost': 'עריכת פוסט',
    'admin.postTitle': 'כותרת',
    'admin.postSummary': 'תקציר',
    'admin.postBody': 'תוכן',
    'admin.postImage': 'תמונה (URL)',
    'admin.postTags': 'תגים (מופרדים בפסיק)',
    'admin.postAuthor': 'כותב',
    'admin.postLanguage': 'שפה',
    'admin.postStatus': 'סטטוס',
    'admin.draft': 'טיוטה',
    'admin.published': 'פורסם',
    'admin.save': 'שמור',
    'admin.delete': 'מחק',
    'admin.approve': 'אשר',
    'admin.reject': 'דחה',
    'admin.export': 'ייצא נתונים',
    
    // Common
    'common.loading': 'טוען...',
    'common.error': 'אירעה שגיאה',
    'common.success': 'הצלחה!',
    'common.close': 'סגור',
    'common.cancel': 'ביטול',
    'common.save': 'שמור',
    'common.edit': 'ערוך',
    'common.delete': 'מחק',
    'common.back': 'חזור',
    'common.next': 'הבא',
    'common.previous': 'הקודם',
    'common.subscribe': 'הירשם לעדכונים',
    'common.subscribeSuccess': 'נרשמת בהצלחה לעדכונים!',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.myths': 'Myths vs Facts',
    'nav.join': 'Join Us',
    'nav.news': 'News & Updates',
    'nav.learning': 'Learning Center',
    
    // Homepage
    'home.title': 'Israeli Advocacy Network on Roblox',
    'home.subtitle': 'Spreading truth, countering misinformation, and building a positive community for Israeli and Jewish players',
    'home.mission': 'Our mission is to represent Israel positively in the Roblox community, educate players with factual information, and create a safe space for Jewish and Israeli gamers.',
    'home.problem': 'We combat misinformation and hate targeting Jewish and Israeli players in Roblox games and on social media platforms.',
    'home.joinUs': 'Join Our Community',
    'home.learnMore': 'Learn More',
    'home.discord': 'Join Discord',
    
    // About
    'about.title': 'About Our Network',
    'about.mission': 'Mission Statement',
    'about.missionText': 'The Israeli Advocacy Network on Roblox is dedicated to promoting accurate information about Israel, supporting Jewish and Israeli players, and fostering positive dialogue within the gaming community.',
    'about.vision': 'Our Vision',
    'about.visionText': 'We envision a Roblox community where Israeli and Jewish players can participate freely without facing discrimination, misinformation, or hatred.',
    'about.team': 'Our Team',
    'about.teamText': 'Our diverse team consists of passionate gamers, educators, and advocates from around the world, united in our commitment to truth and community building.',
    
    // Join Form
    'join.title': 'Join Our Community',
    'join.subtitle': 'Fill out the form below to join the Israeli Advocacy Network on Roblox',
    'form.discord': 'Discord Handle + ID',
    'form.discordPlaceholder': 'yourDiscordUserName',
    'form.roblox': 'Roblox Username',
    'form.robloxLink': 'Roblox Profile Link',
    'form.age': 'Age',
    'form.country': 'Country',
    'form.timezone': 'Time Zone',
    'form.email': 'Email Address',
    'form.languages': 'Languages (free text)',
    'form.motivation': 'Why do you want to join?',
    'form.scenario1': 'How would you respond to someone spreading false information about Israel?',
    'form.scenario2': 'How would you handle antisemitic harassment in a game?',
    'form.availability': 'Weekly availability (hours)',
    'form.conduct': 'I agree to the code of conduct and privacy policy',
    'form.guardian': 'Guardian consent (under 16)',
    'form.projects': 'Project links (optional)',
    'form.submit': 'Submit Application',
    'form.required': 'Required field',
    'form.success': 'Application submitted successfully!',
    'form.successMessage': 'Thank you for your application. We will review it and get back to you soon.',
    
    // Myths vs Facts
    'myths.title': 'Myths vs Facts',
    'myths.subtitle': 'Correcting common misinformation about Israel',
    'myths.myth': 'Myth',
    'myths.fact': 'Fact',
    
    // News
    'news.title': 'News & Updates',
    'news.subtitle': 'Latest updates from our community and activities',
    'news.readMore': 'Read More',
    'news.noNews': 'No news available at the moment',
    'news.filterByTag': 'Filter by tag',
    'news.allTags': 'All tags',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.posts': 'Manage Posts',
    'admin.members': 'Manage Members',
    'admin.newPost': 'New Post',
    'admin.editPost': 'Edit Post',
    'admin.postTitle': 'Title',
    'admin.postSummary': 'Summary',
    'admin.postBody': 'Content',
    'admin.postImage': 'Image (URL)',
    'admin.postTags': 'Tags (comma separated)',
    'admin.postAuthor': 'Author',
    'admin.postLanguage': 'Language',
    'admin.postStatus': 'Status',
    'admin.draft': 'Draft',
    'admin.published': 'Published',
    'admin.save': 'Save',
    'admin.delete': 'Delete',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.export': 'Export Data',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.subscribe': 'Subscribe to Updates',
    'common.subscribeSuccess': 'Successfully subscribed to updates!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to Hebrew
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Set document direction and language
    document.dir = currentLanguage.direction;
    document.lang = currentLanguage.code;
    document.documentElement.setAttribute('dir', currentLanguage.direction);
    document.documentElement.setAttribute('lang', currentLanguage.code);
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { languages };