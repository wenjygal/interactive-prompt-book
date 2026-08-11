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
          ב־BOOST ME אנחנו מאמינים שכל מי שמנהל עסק צריך להיות מסוגל להשתמש באפליקציה הזו — בלי קשר ליכולת הראייה,
          השמיעה, התנועה או הקוגניציה. הדף הזה מתאר את מאמצי הנגישות שלנו ואת הדרך לפנות אלינו.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>רמת הנגישות</h2>
        <p className={styles.text}>
          האפליקציה נבנתה בהתאם לתקן WCAG 2.1 ברמה AA, ובהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות
          לשירות), התשע"ג-2013, ובהתבסס על המלצות התקן הישראלי ת"י 5568.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מה עשינו בפועל</h2>
        <ul className={styles.list}>
          <li>ניגודיות צבעים ביחס של לפחות 4.5:1 בין טקסט לרקע בכל מסכי האפליקציה</li>
          <li>ניווט מלא באמצעות מקלדת (Tab, Enter, Space, Escape) לכל פעולה — כולל העלאת קבצים וגרירתם</li>
          <li>תוויות טקסט לכל שדה: תיאור עסק, חיפוש בספרייה, סינון לפי קטגוריה וסטטוס, ומתגי הגדרות</li>
          <li>קישור "דלג לתוכן הראשי" שנחשף בעת מיקוד מקלדת בתחילת כל עמוד</li>
          <li>סרגל נגישות עצמאי: הגדלת טקסט (שתי דרגות), ניגודיות גבוהה והדגשת קישורים — ההעדפות נשמרות בדפדפן</li>
          <li>אזורי לחיצה של 44×44 פיקסלים לפחות בקישורים ובכפתורים, גם במסכי מובייל</li>
          <li>תמיכה מלאה בכיווניות מימין-לשמאל (RTL) ובעברית, כולל סמלים וחצי ניווט</li>
          <li>תמיכה בהעדפת "הפחתת תנועה" (prefers-reduced-motion) של מערכת ההפעלה</li>
          <li>מבנה כותרות היררכי, סימון אזורי עמוד סמנטיים וטקסט חלופי לכל תמונה משמעותית</li>
          <li>הודעות מצב (טעינה, הצלחה, שגיאה) מוכרזות לקוראי מסך ואינן מסתמכות על צבע בלבד</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>מגבלות ידועות</h2>
        <p className={styles.text}>
          האפליקציה מתפתחת באופן שוטף. תוכן חדש שנוסף לספר הפרומפטים נבדק לנגישות לפני פרסום, אך ייתכנו פערים זמניים
          שטרם אותרו — במיוחד בתוצרים שנוצרים אוטומטית על ידי בינה מלאכותית. פרומפטים שמייבאים מקבצים חיצוניים מוצגים
          כפי שהם, ולכן איננו יכולים להתחייב לנגישות התוכן שהמשתמש מעלה.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>נתקלת במכשול?</h2>
        <div className={styles.contactBox}>
          <p className={styles.text}>
            נשמח לשמוע ולתקן. אפשר לפנות אלינו בכתובת{" "}
            <a href="mailto:meimagineai@gmail.com">meimagineai@gmail.com</a> ולציין את העמוד שבו נתקלת בבעיה, סוג
            המכשול והטכנולוגיה המסייעת שבשימוש. נשיב בהקדם ונטפל בכל פנייה.
          </p>
        </div>
      </div>

      <div className={styles.docMeta}>עודכן לאחרונה: 11 באוגוסט 2026</div>
    </section>
  );
}
