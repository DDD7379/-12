// Learning Center Data Model
// This file contains all lesson content and quizzes
// Edit this file to add/modify lessons without touching the display logic

export interface Lesson {
  lessonName: string;
  lessonText: string;
  introTitle: string;
  introContent: string;
  rulesTitle: string;
  rulesContent: string;
  examplesTitle: string;
  examplesContent: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  lessonId: string;
}

export interface LessonProgress {
  [lessonId: string]: {
    completed: boolean;
    currentStep: number;
    quizCompleted: boolean;
  };
}

// Lessons Data - Add more lessons by following the lessonN pattern
export const lessonsData: Record<string, Lesson> = {
  lesson1: {
    lessonName: "מבוא לדיבייט",
    lessonText: "לומדים מה זה דיבייט ולמה חשוב לדעת לנהל עימות נכון.",
    introTitle: "מבוא",
    introContent: "דיבייט הוא עימות מילולי עם חוקים ברורים שבו המטרה היא לא לצעוק אלא לשכנע בעזרת עובדות וטיעונים. זהו כלי חזק שיעזור לכם להגיב נכון למידע מוטעה ולהציג את העמדה הישראלית בצורה משכנעת ומכבדת.",
    rulesTitle: "החוקים של דיבייט מוצלח",
    rulesContent: "1. תשובה קצרה וברורה - אל תיכנסו לנאומים ארוכים\n2. שמירה על כבוד - גם כשהצד השני לא מכבד\n3. שימוש בעובדות אמיתיות - לא בסיסמאות או רגשות\n4. לא לאבד מיקוד - התמקדו בנושא הספציפי\n5. מבנה תשובה: טענה נגדית + סיבה + עובדה תומכת",
    examplesTitle: "דוגמאות חיות",
    examplesContent: "דוגמה 1:\nטענה: 'ישראל מדינת אפרטהייד'\nתשובה נכונה: 'זה לא נכון. לערבים בישראל יש זכויות אזרח מלאות, כולל זכות בחירה, 14 חברי כנסת ערבים, ושופטים ערבים בבית המשפט העליון. זה שונה לחלוטין ממשטר האפרטהייד בדרום אפריקה.'\n\nדוגמה 2:\nטענה: 'ישראל כובשת את פלסטין'\nתשובה נכונה: 'ישראל הוקמה חוקית ב-1948 על פי החלטת האו״ם 181. ישראל קיבלה את תוכנית החלוקה, אבל המדינות הערביות דחו אותה ופתחו במלחמה נגד ישראל.'"
  },

  lesson2: {
    lessonName: "זיהוי מידע מוטעה",
    lessonText: "איך לזהות חדשות מזויפות ומידע מוטעה על ישראל ברשתות החברתיות.",
    introTitle: "למה חשוב לזהות מידע מוטעה?",
    introContent: "ברשתות החברתיות מופץ הרבה מידע מוטעה על ישראל. חלק מזה נעשה בכוונה להזיק לישראל, וחלק מחוסר ידע. כשחקנים ברובלוקס, אתם צריכים לדעת איך לזהות מידע כזה ולהגיב נכון.",
    rulesTitle: "איך לזהות מידע מוטעה",
    rulesContent: "1. בדקו את המקור - מי פרסם את המידע?\n2. חפשו עוד מקורות - האם מקורות אמינים מדווחים על זה?\n3. שימו לב לתמונות - האם התמונה באמת קשורה לאירוע?\n4. בדקו תאריכים - האם זה מידע עדכני או ישן?\n5. שאלו את עצמכם - האם זה נשמע הגיוני?",
    examplesTitle: "דוגמאות למידע מוטעה נפוץ",
    examplesContent: "דוגמה 1: תמונות ישנות מסוריה או עיראק שמוצגות כאילו הן מעזה\nאיך לזהות: חיפוש תמונה הפוך בגוגל יראה מתי ואיפה התמונה צולמה באמת\n\nדוגמה 2: סטטיסטיקות מוגזמות על מספר הרוגים\nאיך לזהות: השוואה למקורות רשמיים כמו האו״ם או ארגונים בינלאומיים\n\nדוגמה 3: ציטוטים מזויפים של פוליטיקאים ישראלים\nאיך לזהות: חיפוש הציטוט במקורות חדשותיים אמינים"
  },

  lesson3: {
    lessonName: "הגנה על הזהות היהודית",
    lessonText: "איך להתמודד עם אנטישמיות ולהגן על הזהות היהודית שלכם במשחקים.",
    introTitle: "אנטישמיות במשחקים",
    introContent: "לצערנו, אנטישמיות קיימת גם במשחקי רובלוקס. חשוב שתדעו איך לזהות אותה, איך להגיב ואיך להגן על עצמכם ועל שחקנים יהודים אחרים. אתם לא לבד במאבק הזה.",
    rulesTitle: "איך להגיב לאנטישמיות",
    rulesContent: "1. אל תתעלמו - שתיקה נתפסת כהסכמה\n2. תעדו - צלמו מסך של ההודעות האנטישמיות\n3. דווחו - השתמשו במערכת הדיווח של רובלוקס\n4. הגיבו בעובדות - לא ברגש\n5. חפשו תמיכה - פנו לקהילה שלנו או למנהלי המשחק\n6. אל תיכנסו לוויכוחים אישיים - התמקדו בעובדות",
    examplesTitle: "דוגמאות לתגובות נכונות",
    examplesContent: "מצב 1: מישהו אומר 'היהודים שולטים על העולם'\nתגובה: 'זה סטריאוטיפ אנטישמי קלאסי שאין לו בסיס במציאות. יהודים מהווים 0.2% מאוכלוסיית העולם ופועלים במגוון תחומים כמו כל עם אחר.'\n\nמצב 2: מישהו משתמש בסמלים נאציים\nתגובה: דיווח מיידי למנהלי המשחק + צילום מסך + יציאה מהמשחק\n\nמצב 3: 'כל היהודים עשירים'\nתגובה: 'זה סטריאוטיפ שקרי. יש יהודים עניים ועשירים כמו בכל עם. הרבה יהודים ברחבי העולם חיים בעוני.'"
  }
};

// Quizzes Data - Add more quizzes by following the quizN pattern
export const quizzesData: Record<string, Quiz[]> = {
  quiz1: [
    {
      question: "מהי הטעות הכי גדולה בדיון?",
      options: ["לדבר רגוע", "לצעוק ולהיכנס לרגש", "להביא עובדות"],
      correct: 1,
      lessonId: "lesson1"
    },
    {
      question: "מהו המבנה הנכון של תשובה טובה?",
      options: ["התקפה + סיסמה", "טענה נגדית + סיבה + עובדה", "סיפור אישי ארוך"],
      correct: 1,
      lessonId: "lesson1"
    },
    {
      question: "איך כדאי להגיב לטענה 'ישראל מדינת אפרטהייד'?",
      options: [
        "לצעוק 'זה שקר!'",
        "להסביר על זכויות הערבים בישראל עם דוגמאות קונקרטיות",
        "להתעלם"
      ],
      correct: 1,
      lessonId: "lesson1"
    }
  ],

  quiz2: [
    {
      question: "איך בודקים אם תמונה אמיתית?",
      options: ["מסתמכים על מי שפרסם", "עושים חיפוש תמונה הפוך", "שואלים חברים"],
      correct: 1,
      lessonId: "lesson2"
    },
    {
      question: "מה עושים כשרואים מידע מוטעה על ישראל?",
      options: ["מתעלמים", "בודקים במקורות נוספים ומגיבים בעובדות", "משתפים הלאה"],
      correct: 1,
      lessonId: "lesson2"
    },
    {
      question: "איך מזהים ציטוט מזויף?",
      options: ["לפי הרגש שהוא מעורר", "חיפוש במקורות חדשותיים אמינים", "לפי מספר הלייקים"],
      correct: 1,
      lessonId: "lesson2"
    }
  ],

  quiz3: [
    {
      question: "מה עושים כשרואים אנטישמיות במשחק?",
      options: ["מתעלמים", "מדווחים ומתעדים", "עוזבים את המשחק מיד"],
      correct: 1,
      lessonId: "lesson3"
    },
    {
      question: "איך מגיבים לסטריאוטיפ 'היהודים שולטים על העולם'?",
      options: [
        "מסבירים שיהודים הם 0.2% מהעולם ופועלים במגוון תחומים",
        "מסכימים חלקית",
        "מתעלמים"
      ],
      correct: 0,
      lessonId: "lesson3"
    },
    {
      question: "מתי כדאי לפנות לעזרה?",
      options: ["רק במקרים קיצוניים", "תמיד כשמרגישים לא בטוחים", "אף פעם"],
      correct: 1,
      lessonId: "lesson3"
    }
  ]
};

// Utility functions to work with the data
export const getLessonsCount = (): number => {
  return Object.keys(lessonsData).length;
};

export const getQuizzesForLesson = (lessonId: string): Quiz[] => {
  const quizKey = lessonId.replace('lesson', 'quiz');
  return quizzesData[quizKey] || [];
};

export const getLessonIds = (): string[] => {
  return Object.keys(lessonsData).sort((a, b) => {
    const numA = parseInt(a.replace('lesson', ''));
    const numB = parseInt(b.replace('lesson', ''));
    return numA - numB;
  });
};