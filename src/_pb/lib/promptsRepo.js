import { promptsCatalog } from "../data/promptsCatalog.js";
import { storage } from "./storage.js";

// כל הפרומפטים הזמינים לעיון/פתיחה: המובנים + אלה שיובאו מבחוץ ונוספו לספר
export function getAllPrompts() {
  return [...promptsCatalog, ...storage.getImportedPrompts()];
}

export function getPromptById(id) {
  return getAllPrompts().find((p) => p.id === id) || null;
}
