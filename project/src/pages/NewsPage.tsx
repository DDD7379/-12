import React, { useState, useEffect } from 'react';
import { Calendar, User, Tag, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsItem } from '../types';
import { supabase } from '../lib/supabase';

const NewsPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

 // Default news data for fallback
const defaultNews: NewsItem[] = [
  {
    id: 'default-1',
    title: isRTL ? 'ברוכים הבאים למערך ההסברה הישראלית' : 'Welcome to the Israeli Advocacy Network',
    summary: isRTL 
      ? 'אנחנו מזמינים אתכם להצטרף אלינו למאמצים החשובים האלה'
      : 'Our community is committed to fighting misinformation and supporting Israeli and Jewish players on Roblox. We invite you to join us in these important efforts.',
    content: isRTL
      ? 'הקהילה שלנו מחויבת להילחם במידע מוטעה ולתמוך בשחקנים ישראלים ויהודים ברובלוקס. אנחנו מזמינים אתכם להצטרף אלינו למאמצים החשובים האלה.'
      : 'Our community is committed to fighting misinformation and supporting Israeli and Jewish players on Roblox. We invite you to join us in these important efforts.',
    imageUrl: 'https://www.ashops.co.il/Shops/shop_190/products/504/picture_353.jpg',
    publishDate: '2025-09-20',
    author: isRTL ? 'צוות ההנהלה' : 'Management Team',
    tags: [isRTL ? 'הכרזות' : 'announcements'],
    language: currentLanguage.code,
    status: 'published',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-09-20T10:00:00Z'
  },
{
  id: 'default-2',
  title: isRTL ? 'צ׳ארלי קירק' : 'Charlie Kirk',
  summary: isRTL 
    ? 'מי היה צ׳ארלי קירק ולמה דיברו עליו' 
    : 'Who was Charlie Kirk and why was he mentioned',
  content: isRTL
    ? 'צ’ארלי קירק היה פעיל פוליטי אמריקאי שמרן ותומך גדול של טראמפ. הוא הביע תמיכה ברורה בישראל, עמד לצד העם היהודי והדגיש את זכותה להגן על עצמה. בזכותו נוצרה במה חזקה להסברה בעד ישראל בארצות הברית ובעולם, מה שחיזק את הקול שלנו גם במרחבים חדשים כמו רובלוקס. בספטמבר 2025 הוא נורה למוות במהלך נאום, במטרה להשתיק את קולו, אך לעולם לא נשכח אותו.'
    : 'Charlie Kirk was a conservative American political activist and a strong supporter of Trump. He expressed clear support for Israel, stood with the Jewish people and emphasized Israel’s right to defend itself. Thanks to him, a strong platform for advocacy in favor of Israel was created in the US and worldwide, strengthening our voice even in new spaces like Roblox. In September 2025 he was shot dead during a speech, in an attempt to silence his voice, but he will never be forgotten.',
  imageUrl: 'https://ynet-pic1.yit.co.il/cdn-cgi/image/f=auto,w=740,q=75/picserver6/crop_images/2025/09/10/BJjjoH1jle/BJjjoH1jle_0_0_1294_862_0_x-large.jpg',
  publishDate: '2025-09-21',
  author: isRTL ? 'צוות ההנהלה' : 'Management Team',
tags: [
  isRTL ? 'הסברה' : 'advocacy',
  isRTL ? 'תמיכה בישראל' : 'pro-Israel',
  isRTL ? 'חדשות' : 'news',
  isRTL ? 'עולמי' : 'global'
],
  language: currentLanguage.code,
  status: 'published',
  createdAt: '2025-09-21T10:00:00Z',
  updatedAt: '2025-09-21T10:00:00Z'
}

];


  // Load posts from Supabase
  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('language', currentLanguage.code)
        .order('publish_date', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedPosts: NewsItem[] = data.map(post => ({
          id: post.id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          imageUrl: post.image_url,
          publishDate: post.publish_date,
          author: post.author,
          tags: post.tags || [],
          language: post.language,
          status: post.status,
          createdAt: post.created_at,
          updatedAt: post.updated_at
        }));
        setNews(formattedPosts);
        setFilteredNews(formattedPosts);
      } else {
        // Fallback to default news if no posts in database
        const filteredDefaults = defaultNews.filter(item =>
          item.language === currentLanguage.code
        );
        setNews(filteredDefaults);
        setFilteredNews(filteredDefaults);
      }

      setLastUpdate(new Date().toLocaleTimeString(isRTL ? 'he-IL' : 'en-US'));
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback to default news on error
      const filteredDefaults = defaultNews.filter(item =>
        item.language === currentLanguage.code
      );
      setNews(filteredDefaults);
      setFilteredNews(filteredDefaults);
    }
  };


  // Initial load
  useEffect(() => {
    setLoading(true);
    loadPosts();
    setTimeout(() => setLoading(false), 500);
  }, [currentLanguage.code]);

  // Auto-refresh every 10 seconds to catch new posts
  useEffect(() => {
    const interval = setInterval(() => {
      loadPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentLanguage.code]);

  // Handle tag filtering
  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => item.tags.includes(selectedTag)));
    }
  }, [selectedTag, news]);

  const getAllTags = () => {
    const tags = new Set<string>();
    news.forEach(item => item.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage.code === 'he' ? 'he-IL' : 'en-US');
  };

  const handleManualRefresh = () => {
    setLoading(true);
    loadPosts();
    setTimeout(() => setLoading(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? 'טוען חדשות...' : 'Loading news...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-6">
            {isRTL ? 'חדשות ועדכונים' : 'News & Updates'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {isRTL
              ? 'עקבו אחר החדשות והעדכונים החשובים מהקהילה שלנו'
              : 'Stay up to date with important news and updates from our community'
            }
          </p>
        </div>
      </section>

      {/* Control Bar */}
      <section className="py-4 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {getAllTags().length > 0 && (
                <>
                  <span className="text-sm font-medium text-gray-700">
                    {isRTL ? 'סינון לפי תגית:' : 'Filter by tag:'}
                  </span>
                  <button
                    onClick={() => setSelectedTag('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isRTL ? 'הכל' : 'All'}
                  </button>
                  {getAllTags().map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  {isRTL ? 'עדכון אחרון:' : 'Last update:'} {lastUpdate}
                </span>
              )}
              <button
                onClick={handleManualRefresh}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                {isRTL ? 'רענן' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">
                {selectedTag === 'all' 
                  ? (isRTL ? 'אין חדשות זמינות כרגע' : 'No news available at the moment')
                  : (isRTL ? `אין חדשות עם התגית "${selectedTag}"` : `No news with tag "${selectedTag}"`)
                }
              </p>
              <p className="text-sm text-gray-500">
                {isRTL 
                  ? 'חדשות חדשות יופיעו כאן כשהן יפורסמו מפאנל הניהול'
                  : 'New articles will appear here when published from the admin panel'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600">
                  {isRTL 
                    ? `${filteredNews.length} ${selectedTag === 'all' ? 'מאמרים' : `מאמרים עם התגית "${selectedTag}"`}`
                    : `${filteredNews.length} ${selectedTag === 'all' ? 'articles' : `articles tagged "${selectedTag}"`}`
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredNews.map(item => (
                  <article key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {item.imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {item.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                          >
                            <Tag className="h-3 w-3 me-1" />
                            {tag}
                          </button>
                        ))}
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {item.title}
                      </h2>
                      
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 me-1" />
                            <span className="truncate">{item.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 me-1" />
                            {formatDate(item.publishDate)}
                          </div>
                        </div>
                      </div>
                      
                          {/* אם הפוסט פתוח נראה את ה־content, אחרת summary */}
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {expandedPostId === item.id ? item.content : item.summary}
                          </p>
                          
                          <button
                            onClick={() =>
                              setExpandedPostId(expandedPostId === item.id ? null : item.id)
                            }
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                          >
                            {expandedPostId === item.id
                              ? (isRTL ? 'סגור' : 'Close')
                              : (isRTL ? 'קרא עוד' : 'Read More')}
                            <ExternalLink className="h-4 w-4" />
                          </button>

                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
              <RefreshCw className="h-5 w-5" />
              <span className="font-medium">
                {isRTL ? 'עדכון אוטומטי' : 'Auto-updating'}
              </span>
            </div>
            <p className="text-sm text-blue-600">
              {isRTL 
                ? 'כל המידע הכי חשוב במקום אחד, כדי שתמיד תהיו מעודכנים'
                : 'All the most important information in one place, so you’ll always stay updated'
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;