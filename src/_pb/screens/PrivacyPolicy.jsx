import { Link } from "react-router-dom";
import styles from "./AccessibilityStatement.module.css";

export default function PrivacyPolicy() {
  return (
    <section>
      <Link to="/settings" className={styles.backLink}>
        → חזרה להגדרות
      </Link>

      <div className={styles.hero}>
        <h1 className={styles.title}>מדיניות פרטיות</h1>
        <p className={styles.subtitle}>
          האפליקציה נבנתה עם עיקרון פשוט: המידע העסקי שלך נשאר אצלך. הדף הזה מסביר בשפה פשוטה מה קורה עם המידע
          שמוזן.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מה נשמר, ואיפה</h2>
        <p className={styles.text}>
          פרטי הפרופיל העסקי שלך, הפרומפטים שהתאמת אישית, והפרומפטים שסימנת כשמורים — כל אלה נשמרים מקומית על
          המכשיר שלך בלבד (באחסון הדפדפן). אין חשבון, אין התחברות, ואנחנו לא רואים את המידע הזה ולא שומרים ממנו
          עותק בשרת שלנו.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מה אנחנו לא עושים</h2>
        <ul className={styles.list}>
          <li>לא מוכרים, משכירים או משתפים את המידע שלך עם צד שלישי</li>
          <li>לא עוקבים אחריך באתרים אחרים ולא משתמשים בכלי אנליטיקס חיצוניים</li>
          <li>אין לנו גישה לפרטי העסק שלך או לפרומפטים שיצרת — הם נשארים על המכשיר שלך</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>השליטה בידיים שלך</h2>
        <p className={styles.text}>
          בכל רגע אפשר להוריד עותק מלא של הנתונים שלך, או למחוק את הכול לצמיתות מהמכשיר — דרך{" "}
          <Link to="/settings">מסך ההגדרות</Link>.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>שינויים במדיניות</h2>
        <p className={styles.text}>אם נשנה את המדיניות הזו באופן מהותי, נעדכן את התאריך למטה ונציין זאת בתוך האפליקציה.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>שאלות?</h2>
        <div className={styles.contactBox}>
          <p className={styles.text}>
            אפשר לפנות אלינו בכתובת <a href="mailto:privacy@example.com">privacy@example.com</a>.
          </p>
        </div>
      </div>

      <div className={styles.docMeta}>עודכן לאחרונה: 8 ביולי 2026</div>
    </section>
  );
}
