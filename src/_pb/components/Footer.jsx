import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import A11yToolbar from "./A11yToolbar.jsx";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>כל הזכויות שמורות לBOOST ME</span>
      <nav className={styles.links} aria-label="קישורים משפטיים">
        <Link to="/accessibility" className={styles.link}>
          הצהרת נגישות
        </Link>
        <Link to="/privacy" className={styles.link}>
          מדיניות פרטיות
        </Link>
        <A11yToolbar />
      </nav>
    </footer>
  );
}
