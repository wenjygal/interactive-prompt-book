import { extractPlaceholders } from "../data/promptsCatalog.js";
import { fieldKeyForPlaceholder } from "../data/placeholderFieldMap.js";

// בונה מצב התחלתי לרובריקות של פרומפט: לכל placeholder בודק אם יש לו שדה גלובלי תואם
// בפרופיל, וממלא ממנו אוטומטית. placeholder בלי מיפוי (ייחודי לפרומפט) נשאר ריק.
export function buildPlaceholderState(template, profile) {
  const labels = extractPlaceholders(template);
  const state = {};
  for (const label of labels) {
    const fieldKey = fieldKeyForPlaceholder(label);
    const fieldState = fieldKey ? profile.fields[fieldKey] : null;
    if (fieldState && fieldState.value.trim()) {
      const source = fieldState.source === "description" ? "profile-description" : "profile-manual";
      state[label] = { value: fieldState.value, status: fieldState.status, source, fieldKey };
    } else {
      state[label] = { value: "", status: "empty", source: null, fieldKey };
    }
  }
  return state;
}

export function isLongPlaceholder(label) {
  return label.startsWith("הדביקו כאן");
}

export function renderFilledTemplate(template, placeholderState) {
  return template.replace(/\[([^\]]+)\]/g, (match, label) => {
    const value = placeholderState[label]?.value;
    return value && value.trim() ? value : match;
  });
}
