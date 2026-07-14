import { PROFILE_FIELDS } from "../data/profileFields.js";

// מחשב האם הפרופיל ריק / חלקי / מלא, לפי כמה מהשדות מולאו
export function getProfileStatus(profile) {
  const total = PROFILE_FIELDS.length;
  const filled = PROFILE_FIELDS.filter((f) => profile.fields[f.key]?.value?.trim()).length;
  if (filled === 0) return "empty";
  if (filled === total) return "full";
  return "partial";
}

export const PROFILE_STATUS_LABELS = {
  empty: "ריק",
  partial: "חלקי",
  full: "מלא",
};
