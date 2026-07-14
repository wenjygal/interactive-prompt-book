import styles from "./Spinner.module.css";

export default function Spinner({ label = "טוען..." }) {
  return (
    <span role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      {label}
    </span>
  );
}
