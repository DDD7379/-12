import React from 'react';
import { Shield, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MythFact } from '../types';

const MythsPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';

  const mythsAndFacts: MythFact[] = [
    {
      id: '1',
      language: currentLanguage.code,
      myth: isRTL 
        ? 'ישראל כובשת את פלסטין והיא מדינה לא חוקית'
        : 'Israel is occupying Palestine and is an illegitimate state',
      fact: isRTL
        ? 'ישראל היא מדינה ריבונית שהוקמה באופן חוקי ב-1948 על פי החלטת האו"ם 181. ישראל קיבלה את תוכנית החלוקה, בעוד שהמדינות הערביות דחו אותה ופתחו במלחמה.'
        : 'Israel is a sovereign state legally established in 1948 under UN Resolution 181. Israel accepted the partition plan while Arab states rejected it and launched a war.'
    },
    {
      id: '2',
      language: currentLanguage.code,
      myth: isRTL
        ? 'ישראל מבצעת רצח עם בעזה'
        : 'Israel is committing genocide in Gaza',
      fact: isRTL
        ? 'ישראל פועלת להגן על אזרחיה מפני טרור. צה"ל נוקט באמצעי זהירות יוצאי דופן להגן על אזרחים, כולל התרעות מוקדמות ופינוי אזרחים לפני פעולות צבאיות.'
        : 'Israel acts to defend its citizens from terrorism. The IDF takes extraordinary precautions to protect civilians, including advance warnings and civilian evacuations before military operations.'
    },
    {
      id: '3',
      language: currentLanguage.code,
      myth: isRTL
        ? 'היהודים שולטים על התקשורת והבנקים'
        : 'Jews control the media and banks',
      fact: isRTL
        ? 'זהו סטריאוטיפ אנטישמי קלאסי ללא בסיס עובדתי. התקשורת והמערכת הפיננסית מנוהלות על ידי אנשים מרקעים מגוונים. תיאוריות קונספירציה כאלה משמשות להסתת שנאה.'
        : 'This is a classic antisemitic stereotype with no factual basis. Media and financial systems are run by people from diverse backgrounds. Such conspiracy theories are used to incite hatred.'
    },
    {
      id: '4',
      language: currentLanguage.code,
      myth: isRTL
        ? 'ישראל היא מדינת אפרטהייד'
        : 'Israel is an apartheid state',
      fact: isRTL
        ? 'בישראל יש אזרחים ערבים עם זכויות שוות, כולל זכות בחירה, שירות בכנסת ובבית המשפט העליון. זה שונה לחלוטין ממשטר האפרטהייד בדרום אפריקה.'
        : 'Israel has Arab citizens with equal rights, including voting rights, serving in parliament and the Supreme Court. This is completely different from the apartheid regime in South Africa.'
    },
    {
      id: '5',
      language: currentLanguage.code,
      myth: isRTL
        ? 'ישראל נוצרה בגלל השואה מתוך רחמים'
        : 'Israel was created because of the Holocaust out of pity',
      fact: isRTL
        ? 'הציונות והחזון של מדינה יהודית קדמו לשואה בעשרות שנים. הקשר היהודי לארץ ישראל מתוארך לאלפי שנים, והעלייה היהודית החלה במאה ה-19.'
        : 'Zionism and the vision of a Jewish state preceded the Holocaust by decades. The Jewish connection to the Land of Israel dates back thousands of years, and Jewish immigration began in the 19th century.'
    },
    {
      id: '6',
      language: currentLanguage.code,
      myth: isRTL
        ? 'ישראל מונעת מהפלסטינים גישה למים ולמזון'
        : 'Israel prevents Palestinians from accessing water and food',
      fact: isRTL
        ? 'ישראל מספקת מים וחשמל לרשות הפלסטינית ולעזה. ישראל מאפשרת מעבר של סחורות הומניטריות ומזון, תוך ביצוע בדיקות ביטחון נחוצות.'
        : 'Israel supplies water and electricity to the Palestinian Authority and Gaza. Israel allows the passage of humanitarian goods and food while conducting necessary security checks.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-6">
            {t('myths.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('myths.subtitle')}
          </p>
        </div>
      </section>

      {/* Myths vs Facts Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {mythsAndFacts.map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Myth Side */}
                  <div className="bg-red-50 p-8 border-r border-red-100">
                    <div className="flex items-center mb-4">
                      <XCircle className={`h-6 w-6 text-red-600 ${isRTL ? 'ms-3' : 'me-3'} shrink-0`} />
                      <h3 className="text-xl font-bold text-red-800">
                        {t('myths.myth')} #{index + 1}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {item.myth}
                    </p>
                  </div>

                  {/* Fact Side */}
                  <div className="bg-green-50 p-8">
                    <div className="flex items-center mb-4">
                      <CheckCircle className={`h-6 w-6 text-green-600 ${isRTL ? 'ms-3' : 'me-3'} shrink-0`} />
                      <h3 className="text-xl font-bold text-green-800">
                        {t('myths.fact')}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {item.fact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Note */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              {isRTL ? 'חשוב לזכור' : 'Important to Remember'}
            </h3>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {isRTL
                ? 'כשאתם נתקלים במידע מוטעה, הגיבו בכבוד ובעובדות. המטרה היא לחנך ולא לנצח. השתמשו במקורות מהימנים ותמיד הישארו מכבדים בדיאלוג.'
                : 'When encountering misinformation, respond with respect and facts. The goal is to educate, not to win. Use reliable sources and always remain respectful in dialogue.'
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MythsPage;