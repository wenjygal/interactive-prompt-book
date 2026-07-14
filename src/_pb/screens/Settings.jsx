import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";
import { storage } from "../lib/storage.js";
import { getProfileStatus } from "../lib/profileStatus.js";
import ProfileStatusBanner from "../components/ProfileStatusBanner.jsx";
import { useToast } from "../lib/useToast.js";
import Toast from "../components/Toast.jsx";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [profileStatus] = useState(() => getProfileStatus(storage.getProfile()));
  const [deleteStep, setDeleteStep] = useState("idle"); // idle | confirm | done
  const { message, show } = useToast();

  function handleSaveDefaults() {
    storage.saveSettings({ defaultLanguage: settings.defaultLanguage, defaultTone: settings.defaultTone });
    show("ברירות המחדל נשמרו ✓");
  }

  function toggleAutoSuggest() {
    const next = { ...settings, autoSuggestEnabled: !settings.autoSuggestEnabled };
    setSettings(next);
    storage.saveSettings({ autoSuggestEnabled: next.autoSuggestEnabled });
  }

  function handleExport() {
    const data = storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "הנתונים-שלי.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleConfirmDelete() {
    storage.clearAll();
    setDeleteStep("done");
  }

  return (
    <section>
      <h1 className={styles.title}>הגדרות</h1>
      <p className={styles.subtitle}>
        האפליקציה שומרת הכל על המכשיר שלך — אין חשבון, אין סיסמה. כאן אפשר לנהל ברירות מחדל, לגבות נתונים, ולמחוק
        אותם אם צריך.
      </p>

      <div className={styles.group}>
        <div className={styles.groupHead}>
          <h2>סטטוס פרופיל</h2>
        </div>
        <ProfileStatusBanner status={profileStatus} />
      </div>

      <div className={styles.group}>
        <div className={styles.groupHead}>
          <h2>שמירת קבצים</h2>
          <p>
            כפתורי "שמור כקובץ" באפליקציה מורידים את הקובץ לתיקיית ההורדות הרגילה של הדפדפן. כדי שקבצים יישמרו ישירות
            לתיקיית ה-Drive שלך, אפשר להגדיר בדפדפן שתיקיית ההורדות שלו תהיה תיקיית ה-Drive (בהגדרות הדפדפן →
            הורדות).
          </p>
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupHead}>
          <h2>שפה וטון ברירת מחדל</h2>
          <p>ישמשו למילוי אוטומטי כשפרופיל העסק עדיין לא כולל שפה/טון משלו.</p>
        </div>

        <div className={styles.field}>
          <label htmlFor="default-language">שפה ברירת מחדל</label>
          <input
            id="default-language"
            type="text"
            value={settings.defaultLanguage}
            onChange={(e) => setSettings((s) => ({ ...s, defaultLanguage: e.target.value }))}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="default-tone">טון ברירת מחדל</label>
          <input
            id="default-tone"
            type="text"
            placeholder="לדוגמה: ידידותי ומקצועי"
            value={settings.defaultTone}
            onChange={(e) => setSettings((s) => ({ ...s, defaultTone: e.target.value }))}
          />
        </div>

        <div className={styles.saveRow}>
          <button type="button" className={styles.saveBtn} onClick={handleSaveDefaults}>
            שמור ברירות מחדל
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>הצעות אוטומטיות</div>
            <div className={styles.toggleHelp}>מילוי אוטומטי של placeholders מהפרופיל בעת פתיחת פרומפט</div>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={settings.autoSuggestEnabled} onChange={toggleAutoSuggest} />
            <span className={styles.switchTrack} />
          </label>
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupHead}>
          <h2>נתונים ופרטיות</h2>
          <p>הנתונים שלך שייכים לך.</p>
        </div>
        <button type="button" className={styles.secondaryBtn} onClick={handleExport}>
          להוריד עותק מהנתונים שלך
        </button>
        <div className={styles.linkRow}>
          <Link to="/accessibility" className={styles.textLink}>
            הצהרת נגישות
          </Link>
          <Link to="/privacy" className={styles.textLink}>
            מדיניות פרטיות
          </Link>
        </div>
      </div>

      <div className={styles.dangerZone}>
        <div className={styles.groupHead}>
          <h2>איפוס ומחיקת נתונים</h2>
          <p>
            מחיקת הנתונים תסיר לצמיתות מהמכשיר הזה את הפרופיל, הפרומפטים השמורים וכל ההיסטוריה. לא ניתן לבטל פעולה
            זו — מומלץ להוריד עותק מהנתונים לפני כן.
          </p>
        </div>
        {deleteStep === "idle" && (
          <button type="button" className={styles.dangerOutline} onClick={() => setDeleteStep("confirm")}>
            למחוק את כל הנתונים שלי
          </button>
        )}
        {deleteStep === "confirm" && (
          <div>
            <p className={styles.confirmText}>למחוק לצמיתות? הפעולה הזו סופית ולא ניתנת לביטול.</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.dangerFilled} onClick={handleConfirmDelete}>
                כן, למחוק לצמיתות
              </button>
              <button type="button" className={styles.ghostBtn} onClick={() => setDeleteStep("idle")}>
                ביטול
              </button>
            </div>
          </div>
        )}
        {deleteStep === "done" && (
          <div className={styles.deleteDone} role="status">
            <span>✓</span>
            <p>כל הנתונים נמחקו מהמכשיר הזה.</p>
            <button type="button" className={styles.ghostBtn} onClick={() => navigate("/")}>
              לספר הפרומפטים
            </button>
          </div>
        )}
      </div>

      <Toast message={message} />
    </section>
  );
}
