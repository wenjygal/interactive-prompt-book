import { PROFILE_FIELDS } from "../data/profileFields.js";

// שפה לא נספרת: היא ממולאת מראש ("עברית") לכל מבקר ואינה פרט על העסק.
// בלי ההחרגה הזאת מבקר חדש נראה כאילו מילא פרופיל חלקית.
const NOT_COUNTED = new Set(["language"]);

export function isCountedField(key) {
  return !NOT_COUNTED.has(key);
}

// מקור אחד לספירת מילוי הפרופיל: באנר, טבעת בסרגל הצד, מסך הפרופיל
export function getProfileCompletion(profile) {
  const counted = PROFILE_FIELDS.filter((f) => isCountedField(f.key));
  const total = counted.length;
  const filled = counted.filter((f) => profile.fields[f.key]?.value?.trim()).length;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

// מחשב האם הפרופיל ריק / חלקי / מלא, לפי כמה מהשדות מולאו
export function getProfileStatus(profile) {
  const { filled, total } = getProfileCompletion(profile);
  if (filled === 0) return "empty";
  if (filled === total) return "full";
  return "partial";
}

export const PROFILE_STATUS_LABELS = {
  empty: "ריק",
  partial: "חלקי",
  full: "מלא",
};
