import React, { useState } from 'react';
import { User, Edit, Save, X, Mail, MapPin, MessageCircle, Gamepad2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { user, profile, updateProfile } = useAuth();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    country: profile?.country || '',
    discord_handle: profile?.discord_handle || '',
    roblox_username: profile?.roblox_username || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      country: profile?.country || '',
      discord_handle: profile?.discord_handle || '',
      roblox_username: profile?.roblox_username || ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      country: profile?.country || '',
      discord_handle: profile?.discord_handle || '',
      roblox_username: profile?.roblox_username || ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await updateProfile(editData);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(isRTL ? 'הפרופיל עודכן בהצלחה!' : 'Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    }

    setIsLoading(false);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? 'טוען פרופיל...' : 'Loading profile...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center mb-6">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {profile.full_name || profile.username || 'User'}
            </h1>
            <p className="text-xl text-blue-100">
              {profile.username && profile.full_name ? `@${profile.username}` : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isRTL ? 'פרטי פרופיל' : 'Profile Details'}
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    {isRTL ? 'ערוך פרופיל' : 'Edit Profile'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isRTL ? 'שמור' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      {isRTL ? 'ביטול' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 me-3" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 me-3" />
                <span className="text-green-800 text-sm">{success}</span>
              </div>
            )}

            {/* Profile Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline me-2" />
                    {isRTL ? 'שם מלא' : 'Full Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.full_name}
                      onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={isRTL ? 'הזן שם מלא' : 'Enter full name'}
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {profile.full_name || (isRTL ? 'לא צוין' : 'Not specified')}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline me-2" />
                    {isRTL ? 'שם משתמש' : 'Username'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={isRTL ? 'הזן שם משתמש' : 'Enter username'}
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {profile.username || (isRTL ? 'לא צוין' : 'Not specified')}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline me-2" />
                    {isRTL ? 'כתובת אימייל' : 'Email Address'}
                  </label>
                  <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                    {profile.email}
                  </p>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline me-2" />
                    {isRTL ? 'מדינה' : 'Country'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.country}
                      onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={isRTL ? 'הזן מדינה' : 'Enter country'}
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {profile.country || (isRTL ? 'לא צוין' : 'Not specified')}
                    </p>
                  )}
                </div>

                {/* Discord Handle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="h-4 w-4 inline me-2" />
                    שם משתמש בדיסקורד
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.discord_handle}
                      onChange={(e) => setEditData({ ...editData, discord_handle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="username#1234"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {profile.discord_handle || (isRTL ? 'לא צוין' : 'Not specified')}
                    </p>
                  )}
                </div>

                {/* Roblox Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Gamepad2 className="h-4 w-4 inline me-2" />
                    שם משתמש ברובלקוס
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.roblox_username}
                      onChange={(e) => setEditData({ ...editData, roblox_username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="RobloxUsername"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {profile.roblox_username || (isRTL ? 'לא צוין' : 'Not specified')}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'אודות' : 'Bio'}
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={isRTL ? 'ספר על עצמך...' : 'Tell us about yourself...'}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 min-h-[100px]">
                    {profile.bio || (isRTL ? 'לא נכתב עדיין' : 'No bio written yet')}
                  </p>
                )}
              </div>

              {/* Account Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {isRTL ? 'פרטי חשבון' : 'Account Information'}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 me-2" />
                  {isRTL ? 'הצטרף ב-' : 'Joined on '}
                  {new Date(profile.created_at).toLocaleDateString(isRTL ? 'he-IL' : 'en-US')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;