import { useNavigate } from "react-router-dom";
import styles from "./PromptCard.module.css";
import { categoryMeta } from "../data/categories.js";
import { extractPlaceholders } from "../data/promptsCatalog.js";
import { PencilIcon, ChevronLeftIcon } from "./icons.jsx";

export default function PromptCard({ prompt }) {
  const navigate = useNavigate();
  const fieldsCount = extractPlaceholders(prompt.template).length;
  const meta = categoryMeta(prompt.category);

  function open() {
    navigate(`/prompt/${prompt.id}`);
  }

  return (
    <article
      className={styles.card}
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className={styles.topRow}>
        <div className={styles.iconBox} style={{ background: meta.iconBg }}>
          <meta.Icon size={21} color={meta.color} />
        </div>
        <span className={styles.categoryTag} style={{ color: meta.tagText, background: meta.iconBg }}>
          {meta.label}
        </span>
      </div>

      <h3 className={styles.title}>{prompt.title}</h3>
      <p className={styles.output}>{prompt.businessOutput}</p>

      <div className={styles.footer}>
        <span className={styles.fieldsCount}>
          <PencilIcon size={14} />
          {fieldsCount} שדות למילוי
        </span>
        <button type="button" className={styles.openButton} onClick={open}>
          פתח
          <ChevronLeftIcon size={15} />
        </button>
      </div>
    </article>
  );
}
