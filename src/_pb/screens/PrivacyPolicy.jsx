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
          האפליקציה נבנתה עם עיקרון פשוט: המידע העסקי שלכם נשאר אצלכם. הדף הזה מסביר בשפה פשוטה מה קורה עם המידע
          שאתם מזינים.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מה נשמר, ואיפה</h2>
        <p className={styles.text}>
          פרטי הפרופיל העסקי שלכם, הפרומפטים שהתאמתם אישית, והפרומפטים שסימנתם כשמורים — כל אלה נשמרים מקומית על
          המכשיר שלכם בלבד (באחסון הדפדפן). אין חשבון, אין התחברות, ואנחנו לא רואים את המידע הזה ולא שומרים ממנו
          עותק בשרת שלנו.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מה אנחנו לא עושים</h2>
        <ul className={styles.list}>
          <li>לא מוכרים, משכירים או משתפים את המידע שלכם עם צד שלישי</li>
          <li>לא עוקבים אחריכם באתרים אחרים ולא משתמשים בכלי אנליטיקס חיצוניים</li>
          <li>אין לנו גישה לפרטי העסק שלכם או לפרומפטים שיצרתם — הם נשארים על המכשיר שלכם</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>השליטה בידיים שלכם</h2>
        <p className={styles.text}>
          בכל רגע אפשר להוריד עותק מלא של הנתונים שלכם, או למחוק את הכול לצמיתות מהמכשיר — דרך{" "}
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
