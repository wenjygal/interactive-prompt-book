import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Analyze.module.css";
import { PROFILE_FIELDS } from "../data/profileFields.js";
import { CATEGORIES, categoryLabel } from "../data/categories.js";
import { extractPlaceholders } from "../data/promptsCatalog.js";
import { fieldKeyForPlaceholder } from "../data/placeholderFieldMap.js";
import { analyzeProfileCsv, analyzeProfileText, analyzeProfileTextAI } from "../lib/profileParser.js";
import { classifyPromptText } from "../lib/promptClassifier.js";
import { storage } from "../lib/storage.js";
import { useToast } from "../lib/useToast.js";
import Toast from "../components/Toast.jsx";
import Spinner from "../components/Spinner.jsx";

function ConfidenceTag({ status }) {
  if (status === "suggested") return <span className={`${styles.confidence} ${styles.confidenceHigh}`}>ודאות גבוהה</span>;
  if (status === "predicted") return <span className={`${styles.confidence} ${styles.confidenceLow}`}>ודאות נמוכה</span>;
  return <span className={`${styles.confidence} ${styles.confidenceNone}`}>לא זוהה</span>;
}

export default function Analyze() {
  const [mode, setMode] = useState("description");

  return (
    <section>
      <h1 className={styles.title}>ניתוח תיאור עסק וייבוא פרומפטים</h1>
      <p className={styles.subtitle}>נתחו תיאור עסק חדש כדי לעדכן את הפרופיל, או ייבאו פרומפט חיצוני וסווגו אותו אוטומטית לספר.</p>

      <div className={styles.modeTabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "description"}
          className={mode === "description" ? `${styles.modeTab} ${styles.modeTabActive}` : styles.modeTab}
          onClick={() => setMode("description")}
        >
          ניתוח תיאור עסק
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "import"}
          className={mode === "import" ? `${styles.modeTab} ${styles.modeTabActive}` : styles.modeTab}
          onClick={() => setMode("import")}
        >
          ייבוא פרומפט חיצוני
        </button>
      </div>

      {mode === "description" ? <DescriptionMode /> : <ImportMode />}
    </section>
  );
}

function DescriptionMode() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { message, show } = useToast();
  const fileInputRef = useRef(null);

  async function runAiOn(content) {
    setIsAnalyzing(true);
    try {
      const result = await analyzeProfileTextAI(content);
      setSuggestions(result);
      const count = Object.keys(result).length;
      if (count === 0) show("לא זוהו שדות בטקסט הזה");
      else show(`ה-AI זיהה ${count} שדות ✓`);
    } catch (err) {
      const fallback = analyzeProfileText(content);
      setSuggestions(fallback);
      if (Object.keys(fallback).length > 0) {
        show("ניתוח AI נכשל — הופעל ניתוח מקומי כגיבוי");
      } else {
        show(err?.message || "ניתוח נכשל, נסו שוב");
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleFile(file) {
    if (!file) return;
    setIsFileLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const content = String(reader.result || "");
      setText(content);
      setIsFileLoading(false);
      if (file.name.toLowerCase().endsWith(".csv")) {
        setSuggestions(analyzeProfileCsv(content));
      } else {
        await runAiOn(content);
      }
    };
    reader.onerror = () => {
      setIsFileLoading(false);
      show("קריאת הקובץ נכשלה — נסו קובץ אחר");
    };
    reader.readAsText(file);
  }

  function handleAnalyze() {
    if (!text.trim()) return;
    runAiOn(text);
  }

  function handleConfirmAll() {
    if (!suggestions) return;
    const profile = storage.getProfile();
    const nextFields = { ...profile.fields };
    for (const [key, suggestion] of Object.entries(suggestions)) {
      if (nextFields[key]?.status === "confirmed") continue;
      nextFields[key] = { value: suggestion.value, status: "confirmed", source: "description" };
    }
    storage.saveProfile({ ...profile, fields: nextFields });
    show("הפרופיל עודכן ונשמר ✓");
  }

  const suggestionCount = suggestions ? Object.keys(suggestions).length : 0;

  return (
    <div>
      <div className={styles.card}>
        <textarea
          className={styles.textarea}
          placeholder="הדביקו כאן תיאור עסק חופשי..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div
          className={styles.dropzone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
        >
          {isFileLoading ? <Spinner label="קורא את הקובץ..." /> : <span>גררו לכאן קובץ .md או .csv, או לחצו לבחירה</span>}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.csv,text/markdown,text/csv"
            className="visually-hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
        <div className={styles.actionsRow}>
          <button type="button" className={styles.primaryButton} onClick={handleAnalyze} disabled={!text.trim() || isAnalyzing}>
            {isAnalyzing ? "מנתח עם AI..." : "נתח עם AI"}
          </button>
        </div>
      </div>

      {suggestions && (
        <div className={styles.card}>
          <h2 className={styles.resultsHeading}>
            {suggestionCount > 0 ? `נמצאו הצעות ל-${suggestionCount} שדות` : "לא זוהו שדות בטקסט הזה"}
          </h2>
          {PROFILE_FIELDS.filter((f) => suggestions[f.key]).map((field) => (
            <div className={styles.suggestionRow} key={field.key}>
              <span className={styles.suggestionLabel}>{field.label}</span>
              <span className={styles.suggestionValue}>{suggestions[field.key].value}</span>
              <ConfidenceTag status={suggestions[field.key].status} />
            </div>
          ))}
          {suggestionCount > 0 && (
            <div className={styles.actionsRow} style={{ marginTop: "var(--space-3)" }}>
              <button type="button" className={styles.primaryButton} onClick={handleConfirmAll}>
                אשר את כל ההצעות ועדכן את הפרופיל
              </button>
            </div>
          )}
        </div>
      )}
      <Toast message={message} />
    </div>
  );
}

function ImportMode() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [businessOutput, setBusinessOutput] = useState("");
  const [category, setCategory] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [placeholderMap, setPlaceholderMap] = useState(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const { message, show } = useToast();
  const fileInputRef = useRef(null);

  function runClassification(content) {
    const result = classifyPromptText(content);
    setCategory(result.category);
    setConfidence(result.confidence);
    const labels = extractPlaceholders(content);
    setPlaceholderMap(
      labels.map((label) => {
        const fieldKey = fieldKeyForPlaceholder(label);
        return { label, fieldKey };
      })
    );
  }

  function handleFile(file) {
    if (!file) return;
    setIsFileLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      setText(content);
      runClassification(content);
      setIsFileLoading(false);
    };
    reader.onerror = () => {
      setIsFileLoading(false);
      show("קריאת הקובץ נכשלה — נסו קובץ אחר");
    };
    reader.readAsText(file);
  }

  function handleImportAndAnalyze() {
    if (!text.trim()) return;
    runClassification(text);
  }

  function handleSave() {
    if (!title.trim() || !category) return;
    const requiredInput = placeholderMap.map((p) => p.label).join(", ");
    storage.addImportedPrompt({
      category,
      title: title.trim(),
      aiRole: "פרומפט מיובא",
      requiredInput,
      businessOutput: businessOutput.trim() || "—",
      helperText: "פרומפט שיובא ידנית לספר הפרומפטים.",
      template: text,
    });
    show("הפרומפט נוסף לספר בהצלחה ✓");
    setTimeout(() => navigate("/"), 800);
  }

  return (
    <div>
      <div className={styles.card}>
        <textarea
          className={styles.textarea}
          placeholder="הדביקו כאן פרומפט חיצוני..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div
          className={styles.dropzone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
        >
          {isFileLoading ? <Spinner label="קורא את הקובץ..." /> : <span>גררו לכאן קובץ טקסט, או לחצו לבחירה</span>}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt,text/plain,text/markdown"
            className="visually-hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
        <div className={styles.actionsRow}>
          <button type="button" className={styles.primaryButton} onClick={handleImportAndAnalyze} disabled={!text.trim()}>
            ייבא ונתח
          </button>
        </div>
      </div>

      {category && (
        <div className={styles.card}>
          <h2 className={styles.resultsHeading}>תוצאות הניתוח</h2>

          <div className={styles.actionsRow} style={{ marginBottom: "var(--space-4)" }}>
            <span className={styles.categoryBadge}>
              קטגוריה מזוהה: {categoryLabel(category)} ({confidence}% ודאות)
            </span>
            <select className={styles.categorySelect} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {placeholderMap && placeholderMap.length > 0 && (
            <table className={styles.mappingTable}>
              <thead>
                <tr>
                  <th>Placeholder בפרומפט</th>
                  <th>רובריקה מוצעת</th>
                  <th>ודאות</th>
                </tr>
              </thead>
              <tbody>
                {placeholderMap.map(({ label, fieldKey }) => (
                  <tr key={label}>
                    <td>[{label}]</td>
                    <td>{fieldKey ? PROFILE_FIELDS.find((f) => f.key === fieldKey)?.label : "שדה ייחודי לפרומפט"}</td>
                    <td>
                      <ConfidenceTag status={fieldKey ? "suggested" : "empty"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <label className={styles.fieldLabel} htmlFor="import-title">
            שם הפרומפט *
          </label>
          <input
            id="import-title"
            className={styles.textInput}
            style={titleTouched && !title.trim() ? { borderColor: "var(--color-danger)" } : undefined}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTitleTouched(true)}
            placeholder="לדוגמה: מייל תזכורת ללקוחות"
            aria-required="true"
            aria-invalid={titleTouched && !title.trim()}
          />
          {titleTouched && !title.trim() && (
            <p style={{ color: "var(--color-danger)", fontSize: "13px", marginTop: "-8px", marginBottom: "8px" }}>
              יש להזין שם לפרומפט לפני השמירה
            </p>
          )}

          <label className={styles.fieldLabel} htmlFor="import-output">
            תוצר עסקי (מה הפרומפט מייצר)
          </label>
          <input
            id="import-output"
            className={styles.textInput}
            value={businessOutput}
            onChange={(e) => setBusinessOutput(e.target.value)}
            placeholder="לדוגמה: מייל תזכורת קצר ומנומס"
          />

          <div className={styles.actionsRow}>
            <button type="button" className={styles.primaryButton} onClick={handleSave} disabled={!title.trim()}>
              אשר ושמור לספר הפרומפטים
            </button>
          </div>
        </div>
      )}
      <Toast message={message} />
    </div>
  );
}
