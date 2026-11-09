import { Link } from "react-router-dom";
import styles from "./PromptCard.module.css";
import { buildPlaceholderState } from "../lib/placeholderState.js";
import { isCountedField } from "../lib/profileStatus.js";
import { ChevronLeftIcon } from "./icons.jsx";

// שורת פרומפט ברשימה. השורה כולה היא הקישור, בלי כפתור "פתח" נפרד.
// הקטגוריה כבר מופיעה בכותרת הקבוצה, ולכן אין כאן אייקון או תגית.
export default function PromptCard({ prompt, profile }) {
  // אותו כלל ספירה כמו פרופיל העסק: שפה לא נספרת
  const state = buildPlaceholderState(prompt.template, profile);
  const labels = Object.keys(state).filter((label) => isCountedField(state[label].fieldKey));
  const total = labels.length;
  const filled = labels.filter((label) => state[label].source).length;

  return (
    <Link to={`/prompt/${prompt.id}`} className={styles.row}>
      <span className={styles.body}>
        <span className={styles.title}>{prompt.title}</span>
        <span className={styles.output}>{prompt.businessOutput}</span>
        <span className={filled > 0 ? `${styles.fill} ${styles.fillHas}` : styles.fill}>
          {filled > 0 ? `${filled} מתוך ${total} כבר מולאו מהעסק שלך` : `${total} פרטים למילוי`}
        </span>
      </span>
      <ChevronLeftIcon size={18} className={styles.chevron} aria-hidden="true" />
    </Link>
  );
}
