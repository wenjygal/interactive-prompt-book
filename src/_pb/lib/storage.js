import { emptyProfile } from "../data/profileFields.js";

const KEYS = {
  profile: "prompts-book:profile",
  savedPrompts: "prompts-book:saved-prompts",
  importedPrompts: "prompts-book:imported-prompts",
  settings: "prompts-book:settings",
};

const DEFAULT_SETTINGS = {
  defaultLanguage: "עברית",
  defaultTone: "",
  autoSuggestEnabled: true,
};

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getProfile: () => {
    const profile = readJson(KEYS.profile, emptyProfile());
    const settings = storage.getSettings();
    // שפה/טון ברירת מחדל מההגדרות ממלאים את הפרופיל רק אם השדה עוד ריק
    if (!profile.fields.language.value.trim() && settings.defaultLanguage) {
      profile.fields.language = { value: settings.defaultLanguage, status: "suggested", source: "manual" };
    }
    if (!profile.fields.tone.value.trim() && settings.defaultTone) {
      profile.fields.tone = { value: settings.defaultTone, status: "suggested", source: "manual" };
    }
    return profile;
  },
  saveProfile: (profile) => {
    const next = { ...profile, updatedAt: new Date().toISOString() };
    writeJson(KEYS.profile, next);
    return next;
  },

  getSettings: () => ({ ...DEFAULT_SETTINGS, ...readJson(KEYS.settings, {}) }),
  saveSettings: (settings) => {
    const next = { ...storage.getSettings(), ...settings };
    writeJson(KEYS.settings, next);
    return next;
  },

  getSavedPrompts: () => readJson(KEYS.savedPrompts, []),
  createSavedPrompt: (data) => {
    const saved = storage.getSavedPrompts();
    const now = new Date().toISOString();
    const entry = { id: crypto.randomUUID(), favorite: false, ...data, createdAt: now, updatedAt: now };
    writeJson(KEYS.savedPrompts, [...saved, entry]);
    return entry;
  },
  updateSavedPrompt: (id, data) => {
    const saved = storage.getSavedPrompts();
    const index = saved.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("פרומפט שמור לא נמצא");
    const updated = { ...saved[index], ...data, id, updatedAt: new Date().toISOString() };
    saved[index] = updated;
    writeJson(KEYS.savedPrompts, saved);
    return updated;
  },
  deleteSavedPrompt: (id) => {
    const saved = storage.getSavedPrompts().filter((p) => p.id !== id);
    writeJson(KEYS.savedPrompts, saved);
  },

  // פרומפטים שיובאו מבחוץ ונוספו לספר הפרומפטים (מתנהגים כמו פרומפט מובנה)
  getImportedPrompts: () => readJson(KEYS.importedPrompts, []),
  addImportedPrompt: (data) => {
    const imported = storage.getImportedPrompts();
    const entry = { id: `imported-${crypto.randomUUID()}`, isImported: true, createdAt: new Date().toISOString(), ...data };
    writeJson(KEYS.importedPrompts, [...imported, entry]);
    return entry;
  },
  deleteImportedPrompt: (id) => {
    const imported = storage.getImportedPrompts().filter((p) => p.id !== id);
    writeJson(KEYS.importedPrompts, imported);
  },

  exportAll: () => ({
    profile: storage.getProfile(),
    savedPrompts: storage.getSavedPrompts(),
    importedPrompts: storage.getImportedPrompts(),
    settings: storage.getSettings(),
    exportedAt: new Date().toISOString(),
  }),
  clearAll: () => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  },
};
