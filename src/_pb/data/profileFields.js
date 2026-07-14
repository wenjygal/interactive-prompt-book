export const PROFILE_FIELDS = [
  { key: "companyName", label: "שם החברה" },
  { key: "whatCompanyDoes", label: "מה החברה עושה" },
  { key: "targetAudience", label: "קהל יעד" },
  { key: "companyStage", label: "שלב החברה" },
  { key: "market", label: "שוק" },
  { key: "corePain", label: "כאב מרכזי" },
  { key: "solution", label: "פתרון" },
  { key: "businessGoal", label: "מטרה עסקית" },
  { key: "channels", label: "ערוצים" },
  { key: "language", label: "שפה" },
  { key: "tone", label: "טון" },
];

export function emptyProfile() {
  const fields = {};
  for (const { key } of PROFILE_FIELDS) {
    fields[key] = { value: "", status: "empty", source: null };
  }
  fields.language = { value: "עברית", status: "confirmed", source: "manual" };
  return { fields, updatedAt: null };
}
