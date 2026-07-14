import styles from "./ProfileField.module.css";
import StatusBadge from "./StatusBadge.jsx";

const SOURCE_LABELS = {
  manual: "הוזן ידנית",
  description: "מניתוח התיאור",
  profile: "מהפרופיל",
};

export default function ProfileField({ field, state, onChange }) {
  return (
    <div className={styles.field}>
      <div className={styles.head}>
        <label className={styles.label} htmlFor={`field-${field.key}`}>
          {field.label}
        </label>
        <StatusBadge status={state.status} />
      </div>
      <textarea
        id={`field-${field.key}`}
        className={styles.textarea}
        rows={2}
        placeholder="לא ידוע — לא נמלא אוטומטית"
        value={state.value}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {state.source && <span className={styles.source}>{SOURCE_LABELS[state.source] || state.source}</span>}
    </div>
  );
}
