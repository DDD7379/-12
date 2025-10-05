import React from 'react';
import { Star, Users, Target, Heart, Shield, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-full">
                <Star className="h-12 w-12 text-blue-600" fill="currentColor" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">{t('about.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {currentLanguage.code === 'he' 
                ? 'אנחנו קהילה של שחקנים, חינוכיים ופעילים המחויבים לייצג את ישראל בצורה חיובית ברובלוקס'
                : 'We are a community of gamers, educators, and advocates committed to representing Israel positively on Roblox'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-800 mb-6">{t('about.mission')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('about.missionText')}
              </p>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  {currentLanguage.code === 'he' ? 'המטרות שלנו:' : 'Our Goals:'}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                    <span className="text-gray-700">
                      {currentLanguage.code === 'he' 
                        ? 'הגנה על שחקנים יהודים וישראלים'
                        : 'Protect Jewish and Israeli players'
                      }
                    </span>
                  </li>
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                    <span className="text-gray-700">
                      {currentLanguage.code === 'he' 
                        ? 'חינוך הקהילה עם מידע מדויק'
                        : 'Educate the community with accurate information'
                      }
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Users className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                    <span className="text-gray-700">
                      {currentLanguage.code === 'he' 
                        ? 'בניית קהילה חזקה ותומכת'
                        : 'Build a strong and supportive community'
                      }
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🇮🇱</div>
                <h3 className="text-2xl font-bold text-blue-800">
                  {currentLanguage.code === 'he' ? 'גאים להיות ישראלים' : 'Proud to be Israeli'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">10+</div>
                  <div className="text-gray-600 text-sm">
                    {currentLanguage.code === 'he' ? 'חברי קהילה' : 'Members'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-gray-600 text-sm">
                    {currentLanguage.code === 'he' ? 'מדינות' : 'Countries'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-gray-600 text-sm">
                    {currentLanguage.code === 'he' ? 'תמיכה' : 'Support'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">10+</div>
                  <div className="text-gray-600 text-sm">
                    {currentLanguage.code === 'he' ? 'שפות' : 'Languages'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-blue-800 mb-4">{t('about.vision')}</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                {t('about.visionText')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {currentLanguage.code === 'he' ? 'אהבה' : 'Love'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentLanguage.code === 'he' 
                    ? 'מפיצים אהבה ושנאת ממש בקהילה'
                    : 'Spreading love and countering hate in the community'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {currentLanguage.code === 'he' ? 'חינוך' : 'Education'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentLanguage.code === 'he' 
                    ? 'מספקים מידע מדויק ומלא על ישראל'
                    : 'Providing accurate and comprehensive information about Israel'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {currentLanguage.code === 'he' ? 'הגנה' : 'Protection'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentLanguage.code === 'he' 
                    ? 'מגנים על החברים שלנו מפני הטרדות'
                    : 'Protecting our members from harassment and discrimination'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-blue-800 mb-4">{t('about.team')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('about.teamText')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">
                {currentLanguage.code === 'he' ? '?מי אנחנו' : 'Who We Are'}
              </h3>
<div className="grid grid-cols-1 gap-8">
                <div className="text-center card-hover p-6 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
                  <div className="text-3xl mb-2">🎮</div>
                  <h4 className="font-semibold mb-3 text-lg">
                    {currentLanguage.code === 'he' ? 'יוצרי תוכן' : 'Content Creators'}
                  </h4>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {currentLanguage.code === 'he' 
                      ? 'יוצרי התוכן במערך ההסברה הם הקול היצירתי שמעניק חיים למסרים שלנו. הם בונים סרטונים, כותבים פוסטים, מעצבים תמונות ומפתחים רעיונות חדשניים שמצליחים להגיע אל קהלים רחבים ולהשפיע באמת. כל יוצר תוכן מביא את הייחוד שלו בין אם זה בכתיבה, עיצוב, צילום או עריכה וביחד הם הופכים את ההסברה שלנו לנגישה, מרתקת ובעלת כוח אמיתי. בזכותם, המסרים שלנו לא נשארים יבשים או מרוחקים, אלא מקבלים צורה חזותית וסיפורית שמצליחה לעורר הזדהות ולבנות גשרים חדשים עם אנשים בכל העולם. יוצרי התוכן אינם רק חלק טכני במערך, אלא שותפים מלאים לדרך כאלה שיודעים להפוך רעיון פשוט לכלי הסברה עוצמתי'
                      : 'The content creators in the advocacy network are the creative voice that brings our messages to life. They produce videos, write posts, design visuals, and develop innovative ideas that reach wide audiences and create real impact. Each content creator contributes their own unique talent whether in writing, design, photography, or editing and together they make our advocacy accessible, engaging, and truly powerful. Thanks to them, our messages are not dry or distant, but visual and compelling stories that inspire identification and build new bridges with people around the world. Content creators are not just a technical part of the network, but full partners in the mission those who know how to transform a simple idea into a powerful tool for advocacy'
                    }
                  </p>
                </div>
                <div className="text-center card-hover p-6 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
                  <div className="text-3xl mb-2">✊</div>
                  <h4 className="font-semibold mb-3 text-lg">
                    {currentLanguage.code === 'he' ? 'פעילים' : 'Activists'}
                  </h4>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {currentLanguage.code === 'he' 
                      ? 'הפעילים במערך ההסברה הם הלב הפועם של הקהילה שלנו. כל אחד מהם משקיע מזמנו וממרצו כדי להביא את האמת, להתמודד עם מידע שקרי ולחזק את הקול הישראלי במרחבים הדיגיטליים והחברתיים. הם לוקחים חלק בדיונים, משתפים מידע ומחזקים את תחושת הגאווה והזהות של כולנו. בזכותם, המסרים שלנו מגיעים לקהלים חדשים בארץ ובעולם, ומקבלים משקל משמעותי גם בקרב שחקנים צעירים ברובלוקס וגם מחוץ לו. כל פעיל במערך הוא לא רק חבר בקהילה, אלא שליח חשוב שמוביל איתנו את הדרר'
                      : 'The activists in the advocacy network are the beating heart of our community. Each of them dedicates their time and energy to bring the truth, confront misinformation, and strengthen the Israeli voice in digital and social spaces. They take part in discussions, share information, and reinforce our pride and identity. Thanks to them, our messages reach new audiences in Israel and around the world, gaining significant weight among young players on Roblox and beyond. Every activist in the network is not only a member of the community but also an important messenger who leads the way with us'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;