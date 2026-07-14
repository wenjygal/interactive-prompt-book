import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";
import Footer from "./Footer.jsx";
import { BookIcon, UserIcon, ChartIcon, BookmarkIcon, SettingsIcon, MenuIcon, CloseIcon } from "./icons.jsx";
import { storage } from "../lib/storage.js";
import { PROFILE_FIELDS } from "../data/profileFields.js";

const NAV_ITEMS = [
  { to: "/", label: "ספר הפרומפטים", end: true, Icon: BookIcon },
  { to: "/profile", label: "העסק שלי", Icon: UserIcon },
  { to: "/analyze", label: "יבוא", Icon: ChartIcon },
  { to: "/library", label: "שמורים שלי", Icon: BookmarkIcon },
  { to: "/settings", label: "הגדרות", Icon: SettingsIcon },
];

function useProfileCompletion() {
  const [percent] = useState(() => {
    const profile = storage.getProfile();
    const total = PROFILE_FIELDS.length;
    const filled = PROFILE_FIELDS.filter((f) => profile.fields[f.key]?.value?.trim()).length;
    return Math.round((filled / total) * 100);
  });
  return percent;
}

export default function Layout() {
  const percent = useProfileCompletion();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setMenuOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={styles.page}>
      <a href="#main-content" className="visually-hidden">
        דלג לתוכן הראשי
      </a>
      <aside className={styles.sidebar} ref={sidebarRef}>
        <div className={styles.sidebarTop}>
          <Link to="/" className={styles.brand}>
            <div className={styles.logo}>
              <img src={`${import.meta.env.BASE_URL}assets/logo-boost-me-icon.png`} alt="" />
            </div>
            <div className={styles.brandTitle}>ספר פרומפטים חכם</div>
          </Link>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? "סגור תפריט ניווט" : "פתח תפריט ניווט"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        <div className={menuOpen ? `${styles.sidebarBody} ${styles.sidebarBodyOpen}` : styles.sidebarBody}>
          <nav className={styles.nav} aria-label="ניווט ראשי">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
              >
                <span className={styles.badgeIcon}>
                  <item.Icon size={18} />
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/profile" className={styles.profileWidget}>
            <div className={styles.ringWrap}>
              <svg width="46" height="46" viewBox="0 0 46 46">
                <circle className={styles.ringTrack} cx="23" cy="23" r="18.5" />
                <circle
                  className={styles.ringFill}
                  cx="23"
                  cy="23"
                  r="18.5"
                  strokeDasharray={`${(percent / 100) * 116.2} 116.2`}
                />
              </svg>
              <span className={styles.ringPct}>{percent}%</span>
            </div>
            <div>
              <div className={styles.profileWidgetTitle}>ההתקדמות שלכם בפרופיל</div>
              <div className={styles.profileWidgetText}>פרופיל מוכן {percent < 100 ? "חלקית" : "במלואו"}.</div>
            </div>
          </Link>
        </div>
      </aside>

      <main id="main-content" className={styles.main}>
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
