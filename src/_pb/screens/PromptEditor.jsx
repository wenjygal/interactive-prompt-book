import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./PromptEditor.module.css";
import { getPromptById } from "../lib/promptsRepo.js";
import { categoryMeta } from "../data/categories.js";
import { storage } from "../lib/storage.js";
import { buildPlaceholderState, isLongPlaceholder } from "../lib/placeholderState.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Toast from "../components/Toast.jsx";
import { useToast } from "../lib/useToast.js";
import { trackEvent } from "../lib/analytics.js";
import { ChevronRightIcon, CopyIcon, RefreshIcon, SaveIcon, BookmarkIcon } from "../components/icons.jsx";

const STATUS_TO_CLASS = {
  confirmed: "phConfirmed",
  suggested: "phSuggested",
  predicted: "phPredicted",
  empty: "phEmpty",
};

const SOURCE_LABELS = {
  "profile-manual": "מהפרופיל",
  "profile-description": "מהפרופיל (מניתוח תיאור)",
  manual: "ערך מקומי בפרומפט זה",
};

const READINESS_LABELS = {
  missing: { text: "חסרים שדות", tone: "missing" },
  suggested: { text: "הוצעו ערכים — כדאי לעבור עליהם", tone: "suggested" },
  ready: { text: "מוכן לשימוש ✓", tone: "ready" },
};

function sanitizeFileName(title) {
  return title.replace(/[\\/:*?"<>|]/g, "").trim() || "פרומפט";
}

export default function PromptEditor() {
  const { id } = useParams();
  const { message, show } = useToast();
  const prompt = getPromptById(id);
  const [placeholders, setPlaceholders] = useState({});

  useEffect(() => {
    if (!prompt) return;
    const profile = storage.getProfile();
    setPlaceholders(buildPlaceholderState(prompt.template, profile));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!prompt) {
    return (
      <section>
        <p>פרומפט לא נמצא.</p>
        <Link to="/">חזרה לספר הפרומפטים</Link>
      </section>
    );
  }

  const labels = Object.keys(placeholders);
  const remainingCount = labels.filter((label) => !placeholders[label]?.value?.trim()).length;
  const allFilled = labels.length > 0 && remainingCount === 0;

  const readiness = remainingCount > 0
    ? "missing"
    : labels.some((label) => ["suggested", "predicted"].includes(placeholders[label]?.status))
      ? "suggested"
      : "ready";

  const breakdown = labels.reduce(
    (acc, label) => {
      const source = placeholders[label]?.source;
      if (source === "profile-manual") acc.profile += 1;
      else if (source === "profile-description") {
        acc.profile += 1;
        acc.fromDescription += 1;
      } else if (source === "manual") acc.local += 1;
      return acc;
    },
    { profile: 0, fromDescription: 0, local: 0 }
  );

  function updatePlaceholder(label, value) {
    setPlaceholders((prev) => ({
      ...prev,
      [label]: { ...prev[label], value, status: "confirmed", source: "manual" },
    }));
  }

  function handleAutoFill() {
    const profile = storage.getProfile();
    const fresh = buildPlaceholderState(prompt.template, profile);
    setPlaceholders((prev) => {
      const next = { ...prev };
      for (const label of Object.keys(next)) {
        if (!next[label].value?.trim() && fresh[label]?.value?.trim()) {
          next[label] = fresh[label];
        }
      }
      return next;
    });
  }

  function getFilledText() {
    return prompt.template.replace(/\[([^\]]+)\]/g, (match, label) => placeholders[label]?.value || match);
  }

  async function handleCopy() {
    if (!allFilled) {
      show("יש למלא את כל השדות לפני ההעתקה");
      return;
    }
    try {
      await navigator.clipboard.writeText(getFilledText());
      show("הועתק בהצלחה ✓");
      trackEvent("prompt_copy", { promptId: prompt.id, category: prompt.category });
    } catch {
      show("ההעתקה נכשלה — לנסות שוב");
    }
  }

  function handleSaveFile() {
    if (!allFilled) {
      show("יש למלא את כל השדות לפני השמירה");
      return;
    }
    const blob = new Blob([getFilledText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFileName(prompt.title)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    show("הקובץ הורד — אפשר להעביר אותו לתיקיית ה-Drive שלך");
  }

  function handleSaveToLibrary() {
    if (!allFilled) {
      show("יש למלא את כל השדות לפני השמירה");
      return;
    }
    storage.createSavedPrompt({
      promptId: prompt.id,
      title: prompt.title,
      category: prompt.category,
      filledTemplate: getFilledText(),
      placeholderValues: placeholders,
      status: readiness,
    });
    show("נשמר לפרומפטים שמורים ✓");
  }

  const templateParts = prompt.template.split(/(\[[^\]]+\])/g);
  const meta = categoryMeta(prompt.category);

  return (
    <section>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          <ChevronRightIcon size={17} />
          חזרה לספר הפרומפטים
        </Link>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{prompt.title}</h1>
          <span className={styles.categoryTag} style={{ color: meta.tagText, background: meta.iconBg }}>
            {meta.label}
          </span>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>תפקיד ה-AI</span>
            <span className={styles.metaValue}>{prompt.aiRole}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>תוצר עסקי</span>
            <span className={styles.metaValue}>{prompt.businessOutput}</span>
          </div>
        </div>
        <p className={styles.helperText}>{prompt.helperText}</p>
      </div>

      <div className={`${styles.readinessBanner} ${styles[`readiness_${READINESS_LABELS[readiness].tone}`]}`}>
        <span className={styles.readinessDot} />
        <span className={styles.readinessText}>{READINESS_LABELS[readiness].text}</span>
        {!allFilled && <span className={styles.readinessDetail}>נותרו {remainingCount} שדות למילוי</span>}
        {allFilled && (
          <span className={styles.readinessDetail}>
            מה הותאם: {breakdown.profile} מהפרופיל
            {breakdown.fromDescription > 0 ? ` (מתוכם ${breakdown.fromDescription} מניתוח תיאור)` : ""} ·{" "}
            {breakdown.local} הוזנו ידנית בפרומפט זה
          </span>
        )}
      </div>

      <div className={styles.toolbar}>
        <button type="button" className={styles.primaryButton} onClick={handleCopy} disabled={!allFilled}>
          <CopyIcon size={16} />
          העתק ללוח
        </button>
        <button type="button" className={styles.secondaryButton} onClick={handleAutoFill}>
          <RefreshIcon size={16} />
          השלם אוטומטית מהפרופיל
        </button>
        <button type="button" className={styles.secondaryButton} onClick={handleSaveFile} disabled={!allFilled}>
          <SaveIcon size={16} />
          שמור כקובץ (ל-Drive שלך)
        </button>
        <button type="button" className={styles.secondaryButton} onClick={handleSaveToLibrary} disabled={!allFilled}>
          <BookmarkIcon size={16} />
          שמור לפרומפטים שמורים
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.promptPane}>
          <div className={styles.promptPaneHead}>
            <h3 className={styles.promptPaneTitle}>הפרומפט המלא</h3>
            <div className={styles.legend}>
              <span className={styles.legendItem}><span className={styles.legendDot} data-tone="confirmed" />מלא</span>
              <span className={styles.legendItem}><span className={styles.legendDot} data-tone="suggested" />מוצע</span>
              <span className={styles.legendItem}><span className={styles.legendDot} data-tone="predicted" />נחזה</span>
              <span className={styles.legendItem}><span className={styles.legendDot} data-tone="empty" />חסר</span>
            </div>
          </div>
          <div className={styles.promptPaneBody}>
          {templateParts.map((part, index) => {
            const isPlaceholder = part.startsWith("[") && part.endsWith("]");
            if (!isPlaceholder) return <span key={index}>{part}</span>;
            const label = part.slice(1, -1);
            const state = placeholders[label];
            const cls = STATUS_TO_CLASS[state?.status] || "phEmpty";
            const displayText = state?.value?.trim() ? state.value : part;
            return (
              <span key={index} className={`${styles.ph} ${styles[cls]}`}>
                {displayText}
              </span>
            );
          })}
          </div>
        </div>

        <div className={styles.rubricPanel}>
          <h3 className={styles.rubricPanelTitle}>מילוי שדות</h3>
          {labels.map((label) => {
            const state = placeholders[label];
            return (
              <div className={styles.rubricRow} key={label}>
                <div className={styles.rubricHead}>
                  <span className={styles.rubricLabel}>{label}</span>
                  <StatusBadge status={state.status} />
                </div>
                <textarea
                  className={`${styles.rubricTextarea} ${isLongPlaceholder(label) ? styles.rubricTextareaLong : ""} ${state.status === "empty" ? styles.rubricTextareaEmpty : ""}`}
                  value={state.value}
                  placeholder="לא מולא"
                  onChange={(e) => updatePlaceholder(label, e.target.value)}
                  onBlur={() => trackEvent("placeholder_edit", { promptId: prompt.id, field: label })}
                />
                {state.source && <div className={styles.rubricSource}>{SOURCE_LABELS[state.source]}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <Toast message={message} />
    </section>
  );
}
