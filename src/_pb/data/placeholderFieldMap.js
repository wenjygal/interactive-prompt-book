// מיפוי מטקסט placeholder גולמי (כפי שמופיע ב-[...] בתבניות) לשדה גלובלי בפרופיל העסק.
// placeholder שלא מופיע כאן נחשב "ייחודי לפרומפט" — המשתמש ממלא אותו ידנית לכל פרומפט בנפרד
// (למשל: תוכן להדבקה, מספרים, בחירות מרובות-אפשרויות, פרטי ליד ספציפי).
export const PLACEHOLDER_TO_FIELD = {
  "שם החברה": "companyName",
  שם: "companyName",

  "מה החברה עושה": "whatCompanyDoes",
  "מה המוצר עושה": "whatCompanyDoes",
  "מה עושה": "whatCompanyDoes",
  "תיאור קצר של המוצר / השירות": "whatCompanyDoes",
  "תיאור קצר": "whatCompanyDoes",
  תיאור: "whatCompanyDoes",
  "פסקה קצרה שמתארת את החברה": "whatCompanyDoes",

  "קהל יעד": "targetAudience",
  "קהל יעד מרכזי": "targetAudience",
  "קהל היעד": "targetAudience",
  קהל: "targetAudience",

  "שלב החברה": "companyStage",
  שלב: "companyStage",
  "Pre-Seed / Seed / Series A / אחר": "companyStage",

  שוק: "market",
  "השוק שבו החברה פועלת": "market",

  "כאב מרכזי": "corePain",
  כאב: "corePain",
  בעיה: "corePain",
  "הכאב המרכזי שהמוצר פותר": "corePain",

  פתרון: "solution",

  "מטרה עסקית": "businessGoal",
  "המטרה העסקית": "businessGoal",
  מטרה: "businessGoal",

  ערוצים: "channels",
  ערוץ: "channels",

  שפה: "language",

  טון: "tone",
  "טון רצוי": "tone",
};

export function fieldKeyForPlaceholder(placeholderLabel) {
  return PLACEHOLDER_TO_FIELD[placeholderLabel] || null;
}
