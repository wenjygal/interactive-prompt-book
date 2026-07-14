import { useMemo, useState } from "react";
import styles from "./Library.module.css";
import { CATEGORIES, categoryLabel } from "../data/categories.js";
import { storage } from "../lib/storage.js";
import { useToast } from "../lib/useToast.js";
import Toast from "../components/Toast.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const STATUS_OPTIONS = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "ready", label: "מוכן" },
  { value: "suggested", label: "הוצעו ערכים" },
];

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("he-IL", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function sanitizeFileName(title) {
  return title.replace(/[\\/:*?"<>|]/g, "").trim() || "פרומפט";
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Library() {
  const [savedPrompts, setSavedPrompts] = useState(() => storage.getSavedPrompts());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { message, show } = useToast();

  function refresh() {
    setSavedPrompts(storage.getSavedPrompts());
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return savedPrompts.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (favoriteOnly && !p.favorite) return false;
      if (q && !`${p.title} ${p.filledTemplate}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [savedPrompts, query, categoryFilter, statusFilter, favoriteOnly]);

  function toggleFavorite(entry) {
    storage.updateSavedPrompt(entry.id, { favorite: !entry.favorite });
    refresh();
  }

  function handleDuplicate(entry) {
    storage.createSavedPrompt({
      promptId: entry.promptId,
      title: `${entry.title} (עותק)`,
      category: entry.category,
      filledTemplate: entry.filledTemplate,
      placeholderValues: entry.placeholderValues,
      status: entry.status,
      favorite: false,
    });
    refresh();
    show("הפרומפט שוכפל ✓");
  }

  function handleDelete(id) {
    storage.deleteSavedPrompt(id);
    setConfirmDeleteId(null);
    refresh();
    show("הפרומפט נמחק");
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditText(entry.filledTemplate);
    setExpandedId(entry.id);
  }

  function saveEdit(id) {
    storage.updateSavedPrompt(id, { filledTemplate: editText });
    setEditingId(null);
    refresh();
    show("השינויים נשמרו ✓");
  }

  async function handleCopy(entry) {
    try {
      await navigator.clipboard.writeText(entry.filledTemplate);
      show("הועתק בהצלחה ✓");
    } catch {
      show("ההעתקה נכשלה — נסו שוב");
    }
  }

  function handleExportTxt(entry) {
    downloadBlob(entry.filledTemplate, `${sanitizeFileName(entry.title)}.txt`, "text/plain;charset=utf-8");
  }

  function handleExportJson(entry) {
    downloadBlob(JSON.stringify(entry, null, 2), `${sanitizeFileName(entry.title)}.json`, "application/json;charset=utf-8");
  }

  function handleBackupAll() {
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadBlob(JSON.stringify(savedPrompts, null, 2), `גיבוי-ספר-פרומפטים-${dateStr}.json`, "application/json;charset=utf-8");
    show("הגיבוי הורד ✓ — אפשר להעביר אותו לתיקיית ה-Drive שלך");
  }

  return (
    <section>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>פרומטים שמורים</h1>
          <p className={styles.subtitle}>כל הפרומפטים שמילאתם ושמרתם, במקום אחד.</p>
        </div>
        {savedPrompts.length > 0 && (
          <button type="button" className={styles.backupButton} onClick={handleBackupAll}>
            גיבוי הכל ל-Drive (קובץ JSON)
          </button>
        )}
      </div>

      {savedPrompts.length === 0 ? (
        <p className={styles.empty}>עדיין לא שמרתם פרומפטים. פתחו פרומפט, מלאו אותו, ולחצו "שמור לפרומפטים שמורים".</p>
      ) : (
        <>
          <div className={styles.controls}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="חיפוש בפרומפטים שמורים..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">כל הקטגוריות</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={favoriteOnly ? `${styles.favToggle} ${styles.favToggleActive}` : styles.favToggle}
              onClick={() => setFavoriteOnly((v) => !v)}
            >
              ⭐ מועדפים בלבד
            </button>
          </div>

          {filtered.length === 0 && <p className={styles.empty}>לא נמצאו פרומפטים תואמים.</p>}

          <div className={styles.list}>
            {filtered.map((entry) => (
              <div className={styles.card} key={entry.id}>
                <div className={styles.cardHead}>
                  <div className={styles.cardTitleRow}>
                    <button
                      type="button"
                      className={styles.favButton}
                      onClick={() => toggleFavorite(entry)}
                      aria-label={entry.favorite ? "הסר ממועדפים" : "הוסף למועדפים"}
                    >
                      {entry.favorite ? "⭐" : "☆"}
                    </button>
                    <span className={styles.cardTitle}>{entry.title}</span>
                  </div>
                  <StatusBadge status={entry.status === "ready" ? "confirmed" : "suggested"} />
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.categoryTag}>{categoryLabel(entry.category)}</span>
                  <span>עודכן: {formatDate(entry.updatedAt)}</span>
                </div>

                <div className={styles.actionsRow}>
                  <button type="button" className={styles.actionButton} onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                    {expandedId === entry.id ? "סגור" : "פתח"}
                  </button>
                  <button type="button" className={styles.actionButton} onClick={() => handleCopy(entry)}>
                    העתק
                  </button>
                  <button type="button" className={styles.actionButton} onClick={() => startEdit(entry)}>
                    עריכה
                  </button>
                  <button type="button" className={styles.actionButton} onClick={() => handleDuplicate(entry)}>
                    שכפול
                  </button>
                  <button type="button" className={styles.actionButton} onClick={() => handleExportTxt(entry)}>
                    ייצוא TXT
                  </button>
                  <button type="button" className={styles.actionButton} onClick={() => handleExportJson(entry)}>
                    ייצוא JSON
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.dangerButton}`}
                    onClick={() => setConfirmDeleteId(entry.id)}
                  >
                    מחיקה
                  </button>
                </div>

                {confirmDeleteId === entry.id && (
                  <div className={styles.confirmRow}>
                    <span>למחוק את הפרומפט הזה לצמיתות?</span>
                    <button type="button" className={styles.actionButton} onClick={() => handleDelete(entry.id)}>
                      כן, מחק
                    </button>
                    <button type="button" className={styles.actionButton} onClick={() => setConfirmDeleteId(null)}>
                      ביטול
                    </button>
                  </div>
                )}

                {expandedId === entry.id && (
                  <div className={styles.expanded}>
                    {editingId === entry.id ? (
                      <>
                        <textarea
                          className={styles.editTextarea}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className={styles.actionsRow}>
                          <button type="button" className={styles.actionButton} onClick={() => saveEdit(entry.id)}>
                            שמור שינויים
                          </button>
                          <button type="button" className={styles.actionButton} onClick={() => setEditingId(null)}>
                            ביטול
                          </button>
                        </div>
                      </>
                    ) : (
                      entry.filledTemplate
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <Toast message={message} />
    </section>
  );
}
