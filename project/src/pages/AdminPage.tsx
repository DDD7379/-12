import React, { useState, useEffect } from 'react';
import { Settings, Users, FileText, Plus, CreditCard as Edit, Trash2, Check, X, Download, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { NewsItem, Member } from '../types';
import { supabase } from '../lib/supabase';

const AdminPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const { user, profile, loading } = useAuth();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [activeTab, setActiveTab] = useState<'posts' | 'applications' | 'contacts' | 'users'>('posts');
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [applications, setApplications] = useState<Member[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<NewsItem | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Storage keys
  const POSTS_STORAGE_KEY = 'ian_admin_posts';
  const APPLICATIONS_STORAGE_KEY = 'ian_admin_applications';
  const CONTACTS_STORAGE_KEY = 'ian_admin_contacts';

  // Load data when user is authenticated and is admin
  useEffect(() => {
    if (user && profile?.is_admin) {
      loadData();
    }
  }, [user, profile, currentLanguage.code, isRTL]);

  const loadData = async () => {
    try {
      // Load from Supabase first, fallback to localStorage
      await loadFromSupabase();
    } catch (error) {
      console.error('Error loading from Supabase, falling back to localStorage:', error);
      loadFromLocalStorage();
    }
  };

  const loadFromSupabase = async () => {
    // Load posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    if (postsData) {
      const formattedPosts = postsData.map(post => ({
        id: post.id,
        title: post.title,
        summary: post.summary,
        content: post.content,
        imageUrl: post.image_url,
        publishDate: post.publish_date,
        author: post.author,
        tags: post.tags,
        language: post.language,
        status: post.status,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      }));
      setPosts(formattedPosts);
    }

    // Load applications
    const { data: applicationsData, error: applicationsError } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (applicationsError) throw applicationsError;

    if (applicationsData) {
      const formattedApplications = applicationsData.map(app => ({
        id: app.id,
        discordHandle: app.discord_handle,
        robloxUsername: app.roblox_username,
        robloxProfileLink: app.roblox_profile_link,
        age: app.age,
        country: app.country,
        timezone: app.timezone,
        email: app.email,
        languages: app.languages,
        motivation: app.motivation,
        scenario1: app.scenario1,
        scenario2: app.scenario2,
        weeklyAvailability: app.weekly_availability,
        acceptedConduct: app.accepted_conduct,
        guardianConsent: app.guardian_consent,
        projectLinks: app.project_links,
        status: app.status,
        createdAt: app.created_at
      }));
      setApplications(formattedApplications);
    }

    // Load contacts
    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (contactsError) throw contactsError;

    if (contactsData) {
      setContacts(contactsData);
    }

    // Load users with their learning progress
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select(`
        *,
        learning_progress (
          lesson_id,
          completed,
          current_step,
          quiz_completed,
          quiz_score
        )
      `)
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;

    if (usersData) {
      setUsers(usersData);
    }
  };

  const loadFromLocalStorage = () => {
    // Load posts
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Default posts
      const defaultPosts: NewsItem[] = [
      {
        id: '1',
          title: isRTL ? 'ברוכים הבאים למערך ההסברה הישראלית' : 'Welcome to the Israeli Advocacy Network',
          summary: isRTL ? 'הקהילה שלנו מחויבת להילחם במידע מוטעה ולתמוך בשחקנים ישראלים ויהודים ברובלוקס' : 'Our community is committed to fighting misinformation and supporting Israeli and Jewish players on Roblox',
          content: isRTL ? 'הקהילה שלנו מחויבת להילחם במידע מוטעה ולתמוך בשחקנים ישראלים ויהודים ברובלוקס. אנחנו מזמינים אתכם להצטרף אלינו במאמצים החשובים האלה.' : 'Our community is committed to fighting misinformation and supporting Israeli and Jewish players on Roblox. We invite you to join us in these important efforts.',
        publishDate: '2024-01-15',
          author: isRTL ? 'צוות ההנהלה' : 'Management Team',
          tags: [isRTL ? 'הכרזות' : 'announcements'],
          language: currentLanguage.code as 'en' | 'he',
        status: 'published',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
      ];
      setPosts(defaultPosts);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(defaultPosts));
    }

    // Load applications
    const savedApplications = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }

    // Load contacts
    const savedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  };

  const handleSavePost = async (postData: Partial<NewsItem>) => {
    let postToSave: NewsItem;

    if (editingPost) {
      // Update existing post
      postToSave = {
        ...editingPost,
        ...postData,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new post
      postToSave = {
        id: Date.now().toString(),
        title: postData.title || '',
        summary: postData.summary || '',
        content: postData.content || '',
        imageUrl: postData.imageUrl,
        publishDate: postData.publishDate || new Date().toISOString().split('T')[0],
        author: postData.author || profile?.full_name || profile?.username || 'Admin',
        tags: postData.tags || [],
        language: postData.language || 'en',
        status: postData.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Save to Supabase first
    await savePostToSupabase(postToSave);

    // Reload data from Supabase
    await loadFromSupabase();

    setEditingPost(null);
    setShowPostForm(false);
  };

  const savePostToSupabase = async (post: NewsItem) => {
    try {
      const supabasePost = {
        id: post.id,
        title: post.title,
        summary: post.summary,
        content: post.content,
        image_url: post.imageUrl,
        publish_date: post.publishDate,
        author: post.author,
        author_id: user?.id || null,
        tags: post.tags,
        language: post.language,
        status: post.status,
        created_at: post.createdAt,
        updated_at: post.updatedAt
      };

      const { error } = await supabase
        .from('posts')
        .upsert(supabasePost);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving post to Supabase:', error);
      throw error;
    }
  };

  const handleDeletePost = (id: string) => {
    if (confirm(isRTL ? 'האם אתה בטוח שברצונך למחוק את הפוסט?' : 'Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
      
      // Delete from Supabase
      deletePostFromSupabase(id);
    }
  };

  const deletePostFromSupabase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post from Supabase:', error);
    }
  };

  const handleApproveApplication = (id: string) => {
    const updatedApplications = applications.map(m => m.id === id ? { ...m, status: 'approved' as const } : m);
    setApplications(updatedApplications);
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
    
    // Update in Supabase
    updateApplicationInSupabase(id, 'approved');
  };

  const handleRejectApplication = (id: string) => {
    const updatedApplications = applications.map(m => m.id === id ? { ...m, status: 'rejected' as const } : m);
    setApplications(updatedApplications);
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
    
    // Update in Supabase
    updateApplicationInSupabase(id, 'rejected');
  };

  const updateApplicationInSupabase = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating application in Supabase:', error);
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm(isRTL ? 'האם אתה בטוח שברצונך למחוק את הבקשה?' : 'Are you sure you want to delete this application?')) {
      const updatedApplications = applications.filter(a => a.id !== id);
      setApplications(updatedApplications);
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
      
      // Delete from Supabase
      deleteApplicationFromSupabase(id);
    }
  };

  const deleteApplicationFromSupabase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting application from Supabase:', error);
    }
  };

  const handleDeleteContact = (id: string) => {
    if (confirm(isRTL ? 'האם אתה בטוח שברצונך למחוק את ההודעה?' : 'Are you sure you want to delete this contact message?')) {
      const updatedContacts = contacts.filter(c => c.id !== id);
      setContacts(updatedContacts);
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
      
      // Delete from Supabase
      deleteContactFromSupabase(id);
    }
  };

  const deleteContactFromSupabase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting contact from Supabase:', error);
    }
  };

  const exportApplicationData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Discord,Roblox,Age,Country,Email,Status,Created\n"
      + applications.map(m => `${m.id},${m.discordHandle},${m.robloxUsername},${m.age},${m.country},${m.email},${m.status},${m.createdAt}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? 'טוען...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!user || !profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <Settings className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isRTL ? 'גישה נדחתה' : 'Access Denied'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isRTL 
              ? 'אין לך הרשאות מנהל לגשת לפאנל זה'
              : 'You do not have admin permissions to access this panel'
            }
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isRTL ? 'חזור לעמוד הבית' : 'Go to Home Page'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 me-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                {t('admin.title')}
              </h1>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-sm text-gray-600">
                {isRTL ? `שלום, ${profile?.full_name || profile?.username || 'מנהל'}` : `Hello, ${profile?.full_name || profile?.username || 'Admin'}`}
              </span>
              <button
                onClick={() => window.location.href = '/'}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {isRTL ? 'חזור לאתר' : 'Back to Site'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 inline me-2" />
              {t('admin.posts')}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 inline me-2" />
              {isRTL ? 'בקשות הצטרפות' : 'Applications'}
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="h-5 w-5 inline me-2" />
              {isRTL ? 'יצירת קשר' : 'Contact Form'}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 inline me-2" />
              {isRTL ? 'משתמשים' : 'Users'}
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'posts' && (
          <div>
            {/* Posts Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('admin.posts')}</h2>
              <button
                onClick={() => setShowPostForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('admin.newPost')}
              </button>
            </div>

            {/* Posts List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.postTitle')}
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.postAuthor')}
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.postStatus')}
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.postLanguage')}
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.summary}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status === 'published' ? t('admin.published') : t('admin.draft')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.language.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setShowPostForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 me-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            {/* Applications Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isRTL ? 'בקשות הצטרפות' : 'Applications'}
              </h2>
              <button
                onClick={exportApplicationData}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isRTL ? 'ייצא נתונים' : 'Export Data'}
              </button>
            </div>

            {/* Applications List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {applications.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  {isRTL ? 'אין בקשות הצטרפות' : 'No applications yet'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {applications.map(application => (
                    <div key={application.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{application.robloxUsername}</h3>
                              <p className="text-sm text-gray-500">{application.discordHandle}</p>
                            </div>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              application.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status === 'approved' ? (isRTL ? 'אושר' : 'Approved') :
                               application.status === 'rejected' ? (isRTL ? 'נדחה' : 'Rejected') :
                               (isRTL ? 'ממתין' : 'Pending')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedApplication(expandedApplication === application.id ? null : application.id)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                          >
                            {expandedApplication === application.id ? (isRTL ? 'סגור' : 'Hide') : (isRTL ? 'פרטים' : 'Details')}
                          </button>
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveApplication(application.id)}
                                className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                                title={isRTL ? 'אשר' : 'Approve'}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectApplication(application.id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                                title={isRTL ? 'דחה' : 'Reject'}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteApplication(application.id)}
                            className="text-gray-600 hover:text-red-900 p-2 rounded-lg hover:bg-gray-50"
                            title={isRTL ? 'מחק' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedApplication === application.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'פרטי קשר' : 'Contact Information'}</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">{isRTL ? 'אימייל:' : 'Email:'}</span> {application.email}</div>
                                <div><span className="font-medium">{isRTL ? 'גיל:' : 'Age:'}</span> {application.age}</div>
                                <div><span className="font-medium">{isRTL ? 'מדינה:' : 'Country:'}</span> {application.country}</div>
                                <div><span className="font-medium">{isRTL ? 'אזור זמן:' : 'Timezone:'}</span> {application.timezone}</div>
                                <div><span className="font-medium">{isRTL ? 'שפות:' : 'Languages:'}</span> {application.languages}</div>
                                <div><span className="font-medium">{isRTL ? 'זמינות שבועית:' : 'Weekly Availability:'}</span> {application.weeklyAvailability}</div>
                                {application.projectLinks && (
                                  <div><span className="font-medium">{isRTL ? 'קישורי פרויקטים:' : 'Project Links:'}</span> {application.projectLinks}</div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'תשובות לשאלות' : 'Question Responses'}</h4>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <div className="font-medium text-gray-700 mb-1">{isRTL ? 'מדוע אתם רוצים להצטרף?' : 'Why do you want to join?'}</div>
                                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">{application.motivation}</p>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700 mb-1">{isRTL ? 'איך הייתם מגיבים לפישינג?' : 'How would you respond to phishing?'}</div>
                                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">{application.scenario1}</p>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700 mb-1">{isRTL ? 'איך הייתם מתמודדים עם הפרעה?' : 'How would you handle harassment?'}</div>
                                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">{application.scenario2}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            {/* Contacts Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isRTL ? 'יצירת קשר' : 'Contact Form'}
              </h2>
            </div>

            {/* Contacts List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {contacts.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  {isRTL ? 'אין הודעות יצירת קשר' : 'No contact form submissions yet'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contacts.map(contact => (
                    <div key={contact.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                              <p className="text-sm text-gray-500">{contact.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                          >
                            {expandedContact === contact.id ? (isRTL ? 'סגור' : 'Hide') : (isRTL ? 'פרטים' : 'Details')}
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-gray-600 hover:text-red-900 p-2 rounded-lg hover:bg-gray-50"
                            title={isRTL ? 'מחק' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedContact === contact.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'פרטי קשר' : 'Contact Information'}</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">{isRTL ? 'שם משתמש בדיסקורד:' : 'Discord Username:'}</span> {contact.name}</div>
                                <div><span className="font-medium">{isRTL ? 'שם משתמש ברובלוקס:' : 'Roblox Username:'}</span> {contact.robloxUsername || 'לא צוין'}</div>
                                <div><span className="font-medium">{isRTL ? 'אימייל:' : 'Email:'}</span> {contact.email}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'הודעה' : 'Message'}</h4>
                              <div className="text-sm">
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                                  {contact.message.split('\n\n')[1] || contact.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            {/* Users Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isRTL ? 'משתמשים רשומים' : 'Registered Users'}
              </h2>
              <span className="text-sm text-gray-500">
                {isRTL ? `סה"כ: ${users.length} משתמשים` : `Total: ${users.length} users`}
              </span>
            </div>

            {/* Users List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {users.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  {isRTL ? 'אין משתמשים רשומים' : 'No registered users yet'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {users.map(user => {
                    const completedLessons = user.learning_progress?.filter((p: any) => p.completed).length || 0;
                    const totalLessons = 3;
                    const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

                    return (
                      <div key={user.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {user.full_name || user.username || 'Unnamed User'}
                                </h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                {user.is_admin && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mt-1">
                                    {isRTL ? 'מנהל' : 'Admin'}
                                  </span>
                                )}
                              </div>
                              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {isRTL ? 'מרכז הלמידה' : 'Learning Center'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {completedLessons}/{totalLessons} {isRTL ? 'שיעורים' : 'lessons'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                              className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                            >
                              {expandedUser === user.id ? (isRTL ? 'סגור' : 'Hide') : (isRTL ? 'פרטים' : 'Details')}
                            </button>
                          </div>
                        </div>

                        {expandedUser === user.id && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'פרטי פרופיל' : 'Profile Information'}</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">{isRTL ? 'שם מלא:' : 'Full Name:'}</span> {user.full_name || (isRTL ? 'לא צוין' : 'Not specified')}</div>
                                  <div><span className="font-medium">{isRTL ? 'שם משתמש:' : 'Username:'}</span> {user.username || (isRTL ? 'לא צוין' : 'Not specified')}</div>
                                  <div><span className="font-medium">{isRTL ? 'מדינה:' : 'Country:'}</span> {user.country || (isRTL ? 'לא צוין' : 'Not specified')}</div>
                                  <div><span className="font-medium">{isRTL ? 'דיסקורד:' : 'Discord:'}</span> {user.discord_handle || (isRTL ? 'לא צוין' : 'Not specified')}</div>
                                  <div><span className="font-medium">{isRTL ? 'רובלוקס:' : 'Roblox:'}</span> {user.roblox_username || (isRTL ? 'לא צוין' : 'Not specified')}</div>
                                  <div><span className="font-medium">{isRTL ? 'הצטרף:' : 'Joined:'}</span> {new Date(user.created_at).toLocaleDateString(isRTL ? 'he-IL' : 'en-US')}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'התקדמות בלמידה' : 'Learning Progress'}</h4>
                                {user.learning_progress && user.learning_progress.length > 0 ? (
                                  <div className="space-y-3 text-sm">
                                    {user.learning_progress.map((progress: any, index: number) => (
                                      <div key={progress.lesson_id} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium text-gray-700">
                                            {isRTL ? `שיעור ${index + 1}` : `Lesson ${index + 1}`}
                                          </span>
                                          {progress.completed ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                              {isRTL ? 'הושלם' : 'Completed'}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                              {isRTL ? 'בתהליך' : 'In Progress'}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {isRTL ? 'צעד' : 'Step'}: {progress.current_step}/4
                                        </div>
                                        {progress.quiz_completed && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {isRTL ? 'מבחן הושלם ✓' : 'Quiz Completed ✓'}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    {isRTL ? 'טרם התחיל שיעורים' : 'No lessons started yet'}
                                  </p>
                                )}
                              </div>
                            </div>
                            {user.bio && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">{isRTL ? 'אודות' : 'Bio'}</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {user.bio}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <PostFormModal
          post={editingPost}
          onSave={handleSavePost}
          onClose={() => {
            setShowPostForm(false);
            setEditingPost(null);
          }}
          t={t}
        />
      )}
    </div>
  );
};

// Post Form Modal Component
interface PostFormModalProps {
  post: NewsItem | null;
  onSave: (post: Partial<NewsItem>) => void;
  onClose: () => void;
  t: (key: string) => string;
}

const PostFormModal: React.FC<PostFormModalProps> = ({ post, onSave, onClose, t }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    summary: post?.summary || '',
    content: post?.content || '',
    imageUrl: post?.imageUrl || '',
    author: post?.author || '',
    tags: post?.tags.join(', ') || '',
    language: post?.language || 'en',
    status: post?.status || 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {post ? t('admin.editPost') : t('admin.newPost')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.postTitle')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.postSummary')}
              </label>
              <textarea
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.postBody')}
              </label>
              <textarea
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.postAuthor')}
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.postLanguage')}
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'he' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="he">עברית</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.postTags')}
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.postImage')}
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.postStatus')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">{t('admin.draft')}</option>
                <option value="published">{t('admin.published')}</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {t('admin.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;