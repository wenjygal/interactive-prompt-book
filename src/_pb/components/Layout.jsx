import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";
import Footer from "./Footer.jsx";
import { BookIcon, UserIcon, ChartIcon, BookmarkIcon, SettingsIcon, MenuIcon, CloseIcon } from "./icons.jsx";
import { storage } from "../lib/storage.js";
import { getProfileCompletion } from "../lib/profileStatus.js";

const NAV_ITEMS = [
  { to: "/", label: "כל הפרומפטים", end: true, Icon: BookIcon },
  { to: "/profile", label: "העסק שלי", Icon: UserIcon, showProgress: true },
  { to: "/analyze", label: "יבוא", Icon: ChartIcon },
  { to: "/library", label: "שמורים שלי", Icon: BookmarkIcon },
];

const SETTINGS_ITEM = { to: "/settings", label: "הגדרות", Icon: SettingsIcon };

function navClass({ isActive }) {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}

function useProfileCompletion() {
  const [percent] = useState(() => {
    return getProfileCompletion(storage.getProfile()).percent;
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
      <a href="#main-content" className="skip-link">
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
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                <item.Icon size={20} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
                {item.showProgress && (
                  <span className={styles.navProgress} aria-label={`פרופיל העסק מולא ב-${percent} אחוז`}>
                    {percent}%
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <NavLink to={SETTINGS_ITEM.to} className={(state) => `${navClass(state)} ${styles.navBottom}`}>
            <SETTINGS_ITEM.Icon size={20} className={styles.navIcon} />
            <span className={styles.navLabel}>{SETTINGS_ITEM.label}</span>
          </NavLink>
        </div>
      </aside>

      <main id="main-content" className={styles.main}>
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
