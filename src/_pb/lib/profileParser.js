import { PROFILE_FIELDS } from "../data/profileFields.js";

// מילות מפתח/כינויים לכל שדה, לזיהוי שורות "שדה: ערך" בטקסט חופשי.
// מסודר מהארוך לקצר כדי שהתאמה ארוכה (למשל "שם החברה") תנצח התאמה קצרה יותר ("שם").
const FIELD_SYNONYMS = {
  companyName: ["שם החברה", "שם העסק", "שם הסטארטאפ", "שם"],
  whatCompanyDoes: ["מה החברה עושה", "מה אנחנו עושים", "תיאור המוצר", "מה המוצר עושה", "תיאור", "מוצר"],
  targetAudience: ["קהל היעד המרכזי", "קהל היעד", "קהל יעד", "קהל"],
  companyStage: ["שלב החברה", "שלב"],
  market: ["השוק שבו החברה פועלת", "שוק"],
  corePain: ["הכאב המרכזי", "כאב מרכזי", "כאב"],
  solution: ["הפתרון שלנו", "פתרון"],
  businessGoal: ["מטרה עסקית", "מטרה"],
  channels: ["ערוצים", "ערוץ"],
  language: ["שפה"],
  tone: ["טון דיבור", "טון"],
};

// ביטויים לזיהוי חלש (ניחוש) מתוך טקסט חופשי, כשאין שורת "שדה: ערך" מפורשת.
// שמרני בכוונה — עדיף "ריק" על ניחוש גרוע, באותה רוח כמו הפרומפטים עצמם.
const FREEFORM_HINTS = {
  corePain: [/(?:הכאב המרכזי|הבעיה המרכזית)[^.\n]*?[:\-–]?\s*([^.\n]{5,140})/],
  solution: [/(?:הפתרון שלנו|הפתרון הוא)[^.\n]*?[:\-–]?\s*([^.\n]{5,140})/],
  targetAudience: [/(?:מיועד ל|הקהל שלנו הוא)\s*([^.\n]{3,80})/],
  businessGoal: [/(?:המטרה שלנו היא|המטרה העסקית שלנו)[^.\n]*?[:\-–]?\s*([^.\n]{5,140})/],
};

function findLineMatch(text, synonyms) {
  for (const synonym of synonyms) {
    const escaped = synonym.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^\\s*${escaped}\\s*[:\\-–]\\s*(.+)$`, "m");
    const match = text.match(re);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
  }
  return null;
}

function findFreeformMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]?.trim()) {
      return match[1].trim();
    }
  }
  return null;
}

// מנתח טקסט חופשי (תיאור עסק / קובץ מודבק) ומחזיר הצעות לשדות שזוהו.
// לא ממציא נתונים: שדה שלא נמצא לו רמז נשאר ללא הצעה (empty).
export function analyzeProfileText(text) {
  const suggestions = {};
  if (!text || !text.trim()) return suggestions;

  for (const { key } of PROFILE_FIELDS) {
    const lineMatch = findLineMatch(text, FIELD_SYNONYMS[key] || []);
    if (lineMatch) {
      suggestions[key] = { value: lineMatch, status: "suggested" };
      continue;
    }
    const freeform = FREEFORM_HINTS[key];
    if (freeform) {
      const guess = findFreeformMatch(text, freeform);
      if (guess) {
        suggestions[key] = { value: guess, status: "predicted" };
      }
    }
  }

  return suggestions;
}

// ניתוח קובץ CSV פשוט בפורמט "שדה,ערך" בכל שורה
export function analyzeProfileCsv(text) {
  const suggestions = {};
  if (!text || !text.trim()) return suggestions;

  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(",");
    if (!rawKey || rest.length === 0) continue;
    const value = rest.join(",").trim().replace(/^"|"$/g, "");
    if (!value) continue;

    for (const { key: fieldKey } of PROFILE_FIELDS) {
      const synonyms = FIELD_SYNONYMS[fieldKey] || [];
      if (synonyms.some((s) => s === rawKey.trim())) {
        suggestions[fieldKey] = { value, status: "suggested" };
        break;
      }
    }
  }

  return suggestions;
}
