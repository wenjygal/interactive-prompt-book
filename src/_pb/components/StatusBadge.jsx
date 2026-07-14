import styles from "./StatusBadge.module.css";

const LABELS = {
  confirmed: "✓ אושר",
  suggested: "💡 מוצע",
  predicted: "⚠️ נחזה",
  empty: "ריק",
};

export default function StatusBadge({ status }) {
  const safeStatus = LABELS[status] ? status : "empty";
  return <span className={`${styles.badge} ${styles[safeStatus]}`}>{LABELS[safeStatus]}</span>;
}
