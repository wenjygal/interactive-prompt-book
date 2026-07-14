import { Link } from "react-router-dom";
import styles from "./ProfileStatusBanner.module.css";
import { PROFILE_STATUS_LABELS } from "../lib/profileStatus.js";

const BADGE_CLASS = {
  empty: "badgeEmpty",
  partial: "badgePartial",
  full: "badgeFull",
};

const MESSAGES = {
  empty: "עדיין לא מילאת פרופיל עסק. למלא פרופיל או לייבא תיאור כדי שהפרומפטים ימולאו אוטומטית.",
  partial: "הפרופיל שלך מולא חלקית. להשלים אותו כדי שיותר שדות ימולאו אוטומטית בפרומפטים.",
  full: "הפרופיל שלך מלא — הפרומפטים ימולאו אוטומטית ממנו ככל שניתן.",
};

export default function ProfileStatusBanner({ status }) {
  return (
    <div className={styles.banner}>
      <div className={styles.text}>
        <span className={`${styles.badge} ${styles[BADGE_CLASS[status]]}`}>
          פרופיל עסק: {PROFILE_STATUS_LABELS[status]}
        </span>
        <span className={styles.message}>{MESSAGES[status]}</span>
      </div>
      <Link to="/profile" className={styles.cta}>
        גש לפרופיל העסק
      </Link>
    </div>
  );
}
