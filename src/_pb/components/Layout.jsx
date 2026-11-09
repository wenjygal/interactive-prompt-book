import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";
import Footer from "./Footer.jsx";
import { MenuIcon, CloseIcon } from "./icons.jsx";
import { storage } from "../lib/storage.js";
import { PROFILE_FIELDS } from "../data/profileFields.js";

const NAV_ITEMS = [
  { to: "/", label: "ספר הפרומפטים", end: true },
  { to: "/profile", label: "העסק שלי" },
  { to: "/analyze", label: "יבוא" },
  { to: "/library", label: "שמורים שלי" },
  { to: "/settings", label: "הגדרות" },
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
  const barRef = useRef(null);
  const isHome = location.pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (barRef.current && !barRef.current.contains(e.target)) setMenuOpen(false);
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
      <header className={styles.bar} ref={barRef}>
        <div className={styles.barInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.logo}>
              <img src={`${import.meta.env.BASE_URL}assets/logo-boost-me-icon.png`} alt="" />
            </span>
            <span className={styles.brandTitle}>ספר פרומפטים חכם</span>
          </Link>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? "סגור תפריט ניווט" : "פתח תפריט ניווט"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>

          <div id="main-nav" className={menuOpen ? `${styles.navWrap} ${styles.navWrapOpen}` : styles.navWrap}>
            <nav className={styles.nav} aria-label="ניווט ראשי">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Link to="/profile" className={styles.profileChip} aria-label={`הפרופיל שלך מוכן ב-${percent} אחוז`}>
              <span className={styles.chipBar} aria-hidden="true">
                <span style={{ width: `${percent}%` }} />
              </span>
              <span className={styles.chipText}>
                פרופיל <b>{percent}%</b>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className={styles.main}>
        {isHome ? (
          <Outlet />
        ) : (
          <div className={styles.sheet}>
            <Outlet />
            <Footer />
          </div>
        )}
      </main>
    </div>
  );
}
