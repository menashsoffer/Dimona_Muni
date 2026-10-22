# מהתלונה לתובנה

האתר המלווה ליום העיון "שירות לתושב" של תוכנית צוערים לשלטון המקומי, בעיריית דימונה, ביום ראשון 15.11.2026.

כתוב ב-TypeScript, נבנה עם Vite, ומתפרסם אוטומטית ל-GitHub Pages בכל דחיפה ל-`main`.

## מבנה

```
index.html, quiz.html      העמודים (רק המבנה; התוכן נכנס מהקוד)
public/assets/             לוגואים ותמונות (public/assets/people/<שם>.png)
src/
  content/                 כל התוכן: לו"ז, אנשים וקבוצות, סרטון, שאלות החידון ומקורות
  core/                    כלים משותפים: ניווט, אפקטי גלילה, שעון ישראל, עזרי DOM
  features/                כל פיצ'ר בתיקייה משלו, עם הקוד וה-CSS שלו
    now/                   "עכשיו": מה קורה עכשיו ומה הבא
    schedule/              הלו"ז וקו הזמן
    people/                כרטיסי האנשים והקבוצות
    video/                 נגן יוטיוב בתוך האתר
    quiz/                  החידון: game (מצב), view (תצוגה), quiz (חיבור)
  pages/                   נקודת הכניסה של כל עמוד
  styles/                  העיצוב המשותף: צבעים, כותרת, ניווט, כרטיסים, אפקטים
tools/artifact-page.ts     מכין את האתר לפרסום כ-Artifact ב-claude.ai
.github/workflows/pages.yml  בנייה ופרסום ל-GitHub Pages
```

## איך מוסיפים דברים

- **לעדכן תוכן** (שעה, שם, תמונה, תיאור פרויקט, סרטון): רק בקבצים שב-`src/content/`.
- **להוסיף שאלה לחידון**: רשומה חדשה ב-`src/content/quiz.ts`, רק עם מקור שכותב את התשובה במפורש.
- **להוסיף פיצ'ר לעמוד הבית**: תיקייה חדשה ב-`src/features/`, ושורה שמפעילה אותו ב-`src/pages/home.ts`.
- **להוסיף עמוד**: מעתיקים את `quiz.html`, יוצרים לו קובץ ב-`src/pages/`, מוסיפים אותו ל-`vite.config.ts` ושורה אחת ל-`PAGES` ב-`src/core/nav.ts`.

## פקודות

```
npm install        פעם אחת
npm run dev        שרת פיתוח עם רענון אוטומטי
npm run check      בדיקת טיפוסים
npm run build      בנייה ל-dist/
npm run artifact   בנייה + הכנת dist-artifact/index.html ל-Artifact
```

## פרסום ב-GitHub Pages

פעם אחת: Settings → Pages → Source: **GitHub Actions**. מאז כל דחיפה ל-`main` בונה ומפרסמת את האתר.
