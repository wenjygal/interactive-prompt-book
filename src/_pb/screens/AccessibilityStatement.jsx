import { Link } from "react-router-dom";
import styles from "./AccessibilityStatement.module.css";

export default function AccessibilityStatement() {
  return (
    <section>
      <Link to="/settings" className={styles.backLink}>
        → חזרה להגדרות
      </Link>

      <div className={styles.hero}>
        <h1 className={styles.title}>הצהרת נגישות</h1>
        <p className={styles.subtitle}>
          אנחנו מאמינים שכל מי שמנהל עסק צריך להיות מסוגל להשתמש באפליקציה הזו — בלי קשר ליכולת הראייה, השמיעה,
          התנועה או הקוגניציה. הדף הזה מתאר את מאמצי הנגישות שלנו.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>רמת הנגישות</h2>
        <p className={styles.text}>
          האפליקציה נבנתה בהתאם לתקן WCAG 2.1 ברמה AA, ובהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות
          לשירות), התשע"ג-2013, ובהתבסס על המלצות התקן הישראלי (ת"י 5568).
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מה עשינו בפועל</h2>
        <ul className={styles.list}>
          <li>ניגודיות צבעים שנבדקה לכל טקסט באפליקציה, ביחס של לפחות 4.5:1 בין טקסט לרקע</li>
          <li>ניווט מלא באמצעות מקלדת (Tab, Enter, Escape) לכל פעולה — בלי צורך בעכבר</li>
          <li>תמיכה מלאה בכיווניות מימין-לשמאל (RTL) ובשפה העברית, כולל בסמלים ובחיצי ניווט</li>
          <li>סרגל נגישות עצמאי: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים</li>
          <li>קישור "דלג לתוכן הראשי" ופוקוס הגיוני, עם דגש על פעולות בלתי הפיכות (כמו מחיקת נתונים)</li>
          <li>תמיכה בהעדפת "הפחתת תנועה" (prefers-reduced-motion) של מערכת ההפעלה</li>
          <li>תוויות טקסט (aria-label) לכפתורים ומתגים, גם כשאין להם טקסט גלוי</li>
          <li>טקסט חלופי (alt) לכל תמונה משמעותית</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מגבלות ידועות</h2>
        <p className={styles.text}>
          האפליקציה בשלבי פיתוח. תוכן חדש שיתווסף לספר הפרומפטים ייבדק לנגישות לפני פרסום, אבל ייתכנו פערים זמניים
          שטרם אותרו. אנחנו עובדים באופן שוטף על שיפור החוויה עבור כולם.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>נתקלת במכשול?</h2>
        <div className={styles.contactBox}>
          <p className={styles.text}>
            נשמח לשמוע ולתקן. אפשר לפנות אלינו בכתובת{" "}
            <a href="mailto:meimagineai@gmail.com">meimagineai@gmail.com</a>.
          </p>
        </div>
      </div>

      <div className={styles.docMeta}>עודכן לאחרונה: 8 ביולי 2026</div>
    </section>
  );
}
