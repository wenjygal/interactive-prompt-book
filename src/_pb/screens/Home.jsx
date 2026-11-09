import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { CATEGORIES, categoryLabel } from "../data/categories.js";
import { getAllPrompts } from "../lib/promptsRepo.js";
import ProfileStatusBanner from "../components/ProfileStatusBanner.jsx";
import Footer from "../components/Footer.jsx";
import { storage } from "../lib/storage.js";
import { getProfileStatus } from "../lib/profileStatus.js";
import { buildPlaceholderState } from "../lib/placeholderState.js";
import { trackEvent } from "../lib/analytics.js";
import { SearchIcon, ChevronLeftIcon } from "../components/icons.jsx";

const NARROW = "(max-width: 900px)";

function fillStats(prompt, profile) {
  const state = buildPlaceholderState(prompt.template, profile);
  const labels = Object.keys(state);
  const filled = labels.filter((l) => state[l].value?.trim()).length;
  return { state, total: labels.length, filled };
}

// any text with [placeholders]: profile values get the highlighter, missing ones the pen
function Marked({ text, state }) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]$/);
    if (!m) return <span key={i}>{part}</span>;
    const value = state[m[1]]?.value?.trim();
    return value ? (
      <mark key={i} className={styles.filled}>
        {value}
      </mark>
    ) : (
      <span key={i} className={styles.blank}>
        {m[1]}
      </span>
    );
  });
}

function FillCount({ s }) {
  return (
    <span className={styles.rowFill}>
      <span>
        <b>{s.filled}</b> מתוך {s.total}
      </span>
      <span className={styles.rowFillCap}>מהעסק שלך</span>
    </span>
  );
}

function PreviewSlip({ prompt, s, onOpen, inline }) {
  return (
    <div className={inline ? `${styles.previewSheet} ${styles.previewInline}` : styles.previewSheet}>
      {!inline && (
        <h2 id="preview-title" className={styles.previewTitle}>
          {prompt.title}
        </h2>
      )}
      <dl className={styles.meta}>
        <div>
          <dt>תפקיד ה-AI</dt>
          <dd>
            <Marked text={prompt.aiRole} state={s.state} />
          </dd>
        </div>
        <div>
          <dt>תוצר עסקי</dt>
          <dd>
            <Marked text={prompt.businessOutput} state={s.state} />
          </dd>
        </div>
      </dl>

      <p className={styles.fillLine}>
        <b>
          {s.filled} מתוך {s.total}
        </b>{" "}
        שדות כבר ממולאים מהעסק שלך
      </p>

      <div className={styles.page} aria-label="הפרומפט המלא">
        <Marked text={prompt.template} state={s.state} />
      </div>

      <button type="button" className={styles.primary} onClick={onOpen}>
        למילוי והעתקה
        <ChevronLeftIcon size={18} />
      </button>
    </div>
  );
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].key);
  const [query, setQuery] = useState("");
  const [profile] = useState(() => storage.getProfile());
  const [profileStatus] = useState(() => getProfileStatus(profile));
  const [allPrompts] = useState(() => getAllPrompts());
  const [selectedId, setSelectedId] = useState(() => getAllPrompts()[0]?.id);
  const [expandedId, setExpandedId] = useState(null);
  const narrow = useNarrow();
  const chapterRefs = useRef({});

  const stats = useMemo(() => {
    const map = {};
    for (const p of allPrompts) map[p.id] = fillStats(p, profile);
    return map;
  }, [allPrompts, profile]);

  const trimmedQuery = query.trim().toLowerCase();

  const chapters = useMemo(() => {
    const matches = trimmedQuery
      ? allPrompts.filter((p) =>
          [p.title, p.aiRole, p.requiredInput, p.businessOutput, p.helperText].some((field) =>
            field.toLowerCase().includes(trimmedQuery)
          )
        )
      : allPrompts;
    return CATEGORIES.map((cat) => ({ ...cat, prompts: matches.filter((p) => p.category === cat.key) })).filter(
      (c) => c.prompts.length > 0
    );
  }, [allPrompts, trimmedQuery]);

  const resultCount = chapters.reduce((n, c) => n + c.prompts.length, 0);
  const selected = allPrompts.find((p) => p.id === selectedId) || allPrompts[0];
  const selectedStats = selected ? stats[selected.id] : null;

  function openPrompt(id) {
    navigate(`/prompt/${id}`);
  }

  // narrow: first tap opens the slip under the row, a second tap opens the editor
  function pickRow(id) {
    setSelectedId(id);
    if (narrow) {
      if (expandedId === id) openPrompt(id);
      else setExpandedId(id);
    }
  }

  function jumpTo(key) {
    setActiveTab(key);
    setQuery("");
    trackEvent("tab_view", { tab: key });
    requestAnimationFrame(() => {
      chapterRefs.current[key]?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className={styles.spread}>
      {/* right page: the table of contents */}
      <section className={styles.contents} aria-labelledby="book-title">
        <h1 id="book-title" className={styles.title}>
          ספר הפרומפטים <span className={styles.pen}>שלך</span>
        </h1>
        <p className={styles.subtitle}>
          לא צריך להבין בפרומפטים כדי להתחיל. בוחרים נושא, ממלאים כמה פרטים, ומקבלים פרומפט שכתוב בול בשבילך.
        </p>

        <ProfileStatusBanner status={profileStatus} />

        <div className={styles.tools}>
          <nav className={styles.index} aria-label="קטגוריות פרומפטים">
            {CATEGORIES.map((cat) => {
              const count = allPrompts.filter((p) => p.category === cat.key).length;
              const isActive = activeTab === cat.key && !trimmedQuery;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={isActive}
                  className={isActive ? `${styles.indexItem} ${styles.indexItemActive}` : styles.indexItem}
                  onClick={() => jumpTo(cat.key)}
                >
                  {cat.label}
                  <span className={styles.indexCount}>{count}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.searchWrap}>
            <label htmlFor="prompt-search" className="visually-hidden">
              חיפוש פרומפטים
            </label>
            <SearchIcon size={17} className={styles.searchIcon} />
            <input
              id="prompt-search"
              type="search"
              className={styles.searchInput}
              placeholder="חיפוש פרומפט לפי שם, תפקיד או תוצר..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <p className={styles.tally}>
          {trimmedQuery ? `${resultCount} פרומפטים` : `${CATEGORIES.length} נושאים, ${allPrompts.length} פרומפטים מוכנים`}
        </p>

        {resultCount === 0 && <p className={styles.empty}>לא נמצאו פרומפטים מתאימים.</p>}

        {chapters.map((chapter) => (
          <section
            key={chapter.key}
            className={styles.chapter}
            aria-labelledby={`ch-${chapter.key}`}
            ref={(el) => {
              chapterRefs.current[chapter.key] = el;
            }}
          >
            <header className={styles.chapterHead}>
              <h2 id={`ch-${chapter.key}`}>{categoryLabel(chapter.key)}</h2>
              <span>{chapter.prompts.length} פרומפטים</span>
            </header>
            <ul className={styles.rows}>
              {chapter.prompts.map((prompt) => {
                const s = stats[prompt.id];
                const isSelected = narrow ? prompt.id === expandedId : prompt.id === selected?.id;
                return (
                  <li key={prompt.id}>
                    <button
                      type="button"
                      className={isSelected ? `${styles.row} ${styles.rowSelected}` : styles.row}
                      aria-current={isSelected ? "true" : undefined}
                      aria-expanded={narrow ? isSelected : undefined}
                      onClick={() => pickRow(prompt.id)}
                      onDoubleClick={() => openPrompt(prompt.id)}
                    >
                      <span className={styles.rowMain}>
                        <span className={styles.rowTitle}>
                          <span>{prompt.title}</span>
                        </span>
                        <span className={styles.rowOutput}>{prompt.businessOutput}</span>
                      </span>
                      <FillCount s={s} />
                      <ChevronLeftIcon size={16} className={styles.rowChevron} />
                    </button>
                    {narrow && isSelected && (
                      <PreviewSlip prompt={prompt} s={s} inline onOpen={() => openPrompt(prompt.id)} />
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <Footer />
      </section>

      {/* left page: the chosen prompt, already filled from the business */}
      {selected && !narrow && (
        <aside className={styles.preview} aria-labelledby="preview-title" aria-live="polite">
          <PreviewSlip prompt={selected} s={selectedStats} onOpen={() => openPrompt(selected.id)} />
        </aside>
      )}
    </div>
  );
}
