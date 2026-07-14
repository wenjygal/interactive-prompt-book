const CATEGORY_KEYWORDS = {
  marketing: ["שיווק", "מותג", "קמפיין", "לינקדאין", "תוכן", "פוסט", "נחיתה", "מסר", "קופי", "מודעה", "סלוגן"],
  sales: ["מכירה", "מכירות", "פגישה", "לקוח", "עסקה", "פולו", "crm", "דיסקברי", "התנגדות", "דמו", "מוכר"],
  fundraising: ["משקיע", "גיוס", "פיץ", "דק", "סטורי", "סבב", "seed", "pitch", "deck", "הון", "משקיעים"],
  refine: ["שפר", "שיפור", "קצר", "קיצור", "בהיר", "בהירות", "ביקורת", "חדד", "חידוד", "גרסה", "עריכה"],
};

// מסווג טקסט פרומפט לאחת מ-4 הקטגוריות, לפי ספירת מילות מפתח.
// אין כאן AI — זה ניחוש סטטיסטי פשוט; ברירת המחדל היא "שיפור וחידוד" (הכי גנרי) כשאין התאמה ברורה.
export function classifyPromptText(text) {
  const lower = (text || "").toLowerCase();
  const scores = {};
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = keywords.reduce((sum, kw) => {
      const parts = lower.split(kw.toLowerCase());
      return sum + (parts.length - 1);
    }, 0);
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [bestCategory, bestScore] = ranked[0];
  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);

  if (bestScore === 0) {
    return { category: "refine", confidence: 0, scores };
  }

  const confidence = Math.round((bestScore / totalMatches) * 100);
  return { category: bestCategory, confidence, scores };
}
