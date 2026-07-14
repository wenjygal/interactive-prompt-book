import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./A11yToolbar.module.css";
import { useA11yPrefs } from "../lib/useA11yPrefs.js";

const FONT_OPTIONS = [
  { value: "normal", label: "רגיל" },
  { value: "large", label: "גדול" },
  { value: "larger", label: "גדול יותר" },
];

export default function A11yToolbar() {
  const [open, setOpen] = useState(false);
  const { prefs, update, reset } = useA11yPrefs();
  const wrapRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="סרגל נגישות">
          <div className={styles.panelTitle}>הגדרות נגישות</div>

          <div className={styles.group}>
            <span className={styles.groupLabel}>גודל טקסט</span>
            <div className={styles.fontRow}>
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={prefs.fontSize === opt.value ? `${styles.fontButton} ${styles.fontButtonActive}` : styles.fontButton}
                  onClick={() => update({ fontSize: opt.value })}
                  aria-pressed={prefs.fontSize === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.toggleOption}>
            ניגודיות גבוהה
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={prefs.contrast === "high"}
              onChange={(e) => update({ contrast: e.target.checked ? "high" : "normal" })}
            />
          </label>

          <label className={styles.toggleOption}>
            הדגשת קישורים
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={prefs.underline === "on"}
              onChange={(e) => update({ underline: e.target.checked ? "on" : "off" })}
            />
          </label>

          <button type="button" className={styles.resetButton} onClick={reset}>
            איפוס הגדרות נגישות
          </button>

          <Link to="/accessibility" className={styles.statementLink} onClick={() => setOpen(false)}>
            הצהרת נגישות
          </Link>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-label={open ? "סגור הגדרות נגישות" : "פתח הגדרות נגישות"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        הגדרות נגישות
      </button>
    </div>
  );
}
