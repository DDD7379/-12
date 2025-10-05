import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, CheckCircle, ArrowLeft, ArrowRight, Trophy, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { lessonsData, quizzesData, getLessonsCount, getQuizzesForLesson, getLessonIds, Lesson, Quiz, LessonProgress } from '../data/lessonsData';

const LearningCenterPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { user, profile } = useAuth();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [progress, setProgress] = useState<LessonProgress>({});
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const lessonIds = getLessonIds();
  const totalLessons = getLessonsCount();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isRTL ? 'נדרשת התחברות' : 'Login Required'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isRTL 
              ? 'כדי לגשת למרכז הלמידה, עליך להתחבר לחשבון שלך'
              : 'To access the Learning Center, you need to sign in to your account'
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

  // Load progress from database
  useEffect(() => {
    if (user) {
      loadProgressFromDatabase();
    }
  }, [user]);

  const loadProgressFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user!.id);

      if (error) throw error;

      const progressData: LessonProgress = {};
      
      // Initialize all lessons
      lessonIds.forEach(lessonId => {
        progressData[lessonId] = {
          completed: false,
          currentStep: 0,
          quizCompleted: false
        };
      });

      // Update with saved progress
      data?.forEach(item => {
        progressData[item.lesson_id] = {
          completed: item.completed,
          currentStep: item.current_step,
          quizCompleted: item.quiz_completed
        };
      });

      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save progress to database
  const saveProgress = async (newProgress: LessonProgress) => {
    setProgress(newProgress);

    // Save to database
    try {
      for (const [lessonId, progressData] of Object.entries(newProgress)) {
        const { error } = await supabase
          .from('learning_progress')
          .upsert({
            user_id: user!.id,
            lesson_id: lessonId,
            completed: progressData.completed,
            current_step: progressData.currentStep,
            quiz_completed: progressData.quizCompleted,
            quiz_score: 0,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,lesson_id'
          });

        if (error) {
          console.error('Error saving progress for lesson', lessonId, ':', error);
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = (): number => {
    const completedLessons = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // Check if lesson is unlocked
  const isLessonUnlocked = (lessonId: string): boolean => {
    const lessonIndex = lessonIds.indexOf(lessonId);
    if (lessonIndex === 0) return true; // First lesson is always unlocked
    
    const previousLessonId = lessonIds[lessonIndex - 1];
    return progress[previousLessonId]?.completed || false;
  };

  // Start a lesson
  const startLesson = (lessonId: string) => {
    if (!isLessonUnlocked(lessonId)) return;
    
    setSelectedLesson(lessonId);
    setCurrentStep(0);
    setCurrentQuizIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizScore(0);
  };

  // Navigate between lesson steps
  const navigateStep = (direction: 'next' | 'prev') => {
    if (!selectedLesson) return;

    if (direction === 'next') {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Start quiz
        setCurrentStep(4);
      }
    } else {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Handle quiz answer selection
  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  // Navigate quiz questions
  const navigateQuiz = (direction: 'next' | 'prev') => {
    if (!selectedLesson) return;
    
    const quizzes = getQuizzesForLesson(selectedLesson);
    
    if (direction === 'next') {
      if (currentQuizIndex < quizzes.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
      } else {
        // Finish quiz
        finishQuiz();
      }
    } else {
      if (currentQuizIndex > 0) {
        setCurrentQuizIndex(currentQuizIndex - 1);
      }
    }
  };

  // Finish quiz and calculate results
  const finishQuiz = async () => {
    if (!selectedLesson) return;
    
    const quizzes = getQuizzesForLesson(selectedLesson);
    let score = 0;
    
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizzes[index].correct) {
        score++;
      }
    });
    
    setQuizScore(score);
    setShowResults(true);
    
    // Mark lesson as completed if passed (70% or higher)
    const passingScore = Math.ceil(quizzes.length * 0.7);
    if (score >= passingScore) {
      const newProgress = { ...progress };
      newProgress[selectedLesson] = {
        ...newProgress[selectedLesson],
        completed: true,
        quizCompleted: true
      };
      await saveProgress(newProgress);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{isRTL ? 'טוען את ההתקדמות שלך...' : 'Loading your progress...'}</p>
        </div>
      </div>
    );
  }

  // Close lesson view
  const closeLesson = () => {
    setSelectedLesson(null);
    setCurrentStep(0);
    setCurrentQuizIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizScore(0);
  };

  // Render lesson content based on current step
  const renderLessonContent = () => {
    if (!selectedLesson) return null;
    
    const lesson = lessonsData[selectedLesson];
    const quizzes = getQuizzesForLesson(selectedLesson);
    
    switch (currentStep) {
      case 0: // Introduction
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-800">{lesson.introTitle}</h2>
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{lesson.introContent}</p>
            </div>
          </div>
        );
        
      case 1: // Rules
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-800">{lesson.rulesTitle}</h2>
            <div className="bg-green-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{lesson.rulesContent}</p>
            </div>
          </div>
        );
        
      case 2: // Examples
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-800">{lesson.examplesTitle}</h2>
            <div className="bg-yellow-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{lesson.examplesContent}</p>
            </div>
          </div>
        );
        
      case 3: // Pre-quiz
        return (
          <div className="space-y-6 text-center">
            <div className="bg-purple-50 p-8 rounded-xl">
              <Trophy className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                {isRTL ? 'מוכנים למבחן?' : 'Ready for the Quiz?'}
              </h2>
              <p className="text-gray-700 mb-6">
                {isRTL 
                  ? `המבחן כולל ${quizzes.length} שאלות. צריך לענות נכון על לפחות ${Math.ceil(quizzes.length * 0.7)} כדי לעבור.`
                  : `The quiz contains ${quizzes.length} questions. You need to answer at least ${Math.ceil(quizzes.length * 0.7)} correctly to pass.`
                }
              </p>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {isRTL ? 'התחל מבחן' : 'Start Quiz'}
              </button>
            </div>
          </div>
        );
        
      case 4: // Quiz
        if (showResults) {
          const passingScore = Math.ceil(quizzes.length * 0.7);
          const passed = quizScore >= passingScore;
          
          return (
            <div className="space-y-6 text-center">
              <div className={`p-8 rounded-xl ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                {passed ? (
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                ) : (
                  <Target className="h-16 w-16 text-red-600 mx-auto mb-4" />
                )}
                <h2 className={`text-2xl font-bold mb-4 ${passed ? 'text-green-800' : 'text-red-800'}`}>
                  {passed 
                    ? (isRTL ? 'כל הכבוד! עברת את השיעור' : 'Congratulations! You passed the lesson')
                    : (isRTL ? 'לא עברת הפעם' : 'You didn\'t pass this time')
                  }
                </h2>
                <p className="text-gray-700 mb-6">
                  {isRTL 
                    ? `ענית נכון על ${quizScore} מתוך ${quizzes.length} שאלות`
                    : `You answered ${quizScore} out of ${quizzes.length} questions correctly`
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={closeLesson}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {isRTL ? 'חזור לרשימת השיעורים' : 'Back to Lessons'}
                  </button>
                  {!passed && (
                    <button
                      onClick={() => {
                        setCurrentStep(4);
                        setCurrentQuizIndex(0);
                        setSelectedAnswers([]);
                        setShowResults(false);
                        setQuizScore(0);
                      }}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      {isRTL ? 'נסה שוב' : 'Try Again'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }
        
        const currentQuiz = quizzes[currentQuizIndex];
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-800">
                {isRTL ? 'מבחן' : 'Quiz'}
              </h2>
              <span className="text-sm text-gray-500">
                {currentQuizIndex + 1} / {quizzes.length}
              </span>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {currentQuiz.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full text-start p-4 rounded-lg border transition-colors ${
                      selectedAnswers[currentQuizIndex] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium me-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => navigateQuiz('prev')}
                disabled={currentQuizIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                {isRTL ? 'הקודם' : 'Previous'}
              </button>
              
              <button
                onClick={() => navigateQuiz('next')}
                disabled={selectedAnswers[currentQuizIndex] === undefined}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuizIndex === quizzes.length - 1 
                  ? (isRTL ? 'סיים מבחן' : 'Finish Quiz')
                  : (isRTL ? 'הבא' : 'Next')
                }
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // If viewing a lesson, show lesson interface
  if (selectedLesson) {
    const lesson = lessonsData[selectedLesson];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Lesson Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={closeLesson}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                {isRTL ? 'חזור' : 'Back'}
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-800">{lesson.lessonName}</h1>
                <p className="text-gray-600">{lesson.lessonText}</p>
              </div>
              
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
            
            {/* Progress indicator */}
            {currentStep < 4 && (
              <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Lesson Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {renderLessonContent()}
            
            {/* Navigation buttons for lesson steps */}
            {currentStep < 3 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigateStep('prev')}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isRTL ? 'הקודם' : 'Previous'}
                </button>
                
                <button
                  onClick={() => navigateStep('next')}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isRTL ? 'הבא' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main learning center view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-6">
            {isRTL ? 'מרכז הלמידה' : 'Learning Center'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {isRTL
              ? 'למדו איך להגיב נכון למידע מוטעה ולהגן על ישראל ברובלוקס'
              : 'Learn how to respond correctly to misinformation and defend Israel on Roblox'
            }
          </p>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isRTL ? 'ההתקדמות שלך' : 'Your Progress'}
              </h2>
              <span className="text-2xl font-bold text-blue-600">
                {getCompletionPercentage()}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            
            <p className="text-gray-600 text-center">
              {isRTL 
                ? `השלמת ${Object.values(progress).filter(p => p.completed).length} מתוך ${totalLessons} שיעורים`
                : `Completed ${Object.values(progress).filter(p => p.completed).length} out of ${totalLessons} lessons`
              }
            </p>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessonIds.map((lessonId, index) => {
              const lesson = lessonsData[lessonId];
              const isUnlocked = isLessonUnlocked(lessonId);
              const isCompleted = progress[lessonId]?.completed || false;
              
              return (
                <div
                  key={lessonId}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                    isUnlocked ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => isUnlocked && startLesson(lessonId)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-100' 
                          : isUnlocked 
                          ? 'bg-blue-100' 
                          : 'bg-gray-100'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : isUnlocked ? (
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Lock className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <span className="text-sm font-medium text-gray-500">
                        {isRTL ? `שיעור ${index + 1}` : `Lesson ${index + 1}`}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {lesson.lessonName}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {lesson.lessonText}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isCompleted 
                          ? 'text-green-600' 
                          : isUnlocked 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`}>
                        {isCompleted 
                          ? (isRTL ? 'הושלם' : 'Completed')
                          : isUnlocked 
                          ? (isRTL ? 'זמין' : 'Available')
                          : (isRTL ? 'נעול' : 'Locked')
                        }
                      </span>
                      
                      {isUnlocked && (
                        <span className="text-sm text-gray-500">
                          {getQuizzesForLesson(lessonId).length} {isRTL ? 'שאלות' : 'questions'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningCenterPage;