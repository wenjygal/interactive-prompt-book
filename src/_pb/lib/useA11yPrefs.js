import { useEffect, useState } from "react";

const STORAGE_KEY = "prompts-book:a11y-prefs";

const DEFAULTS = {
  fontSize: "normal", // normal | large | larger
  contrast: "normal", // normal | high
  underline: "off", // off | on
};

function readPrefs() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return DEFAULTS;
  }
}

function applyPrefs(prefs) {
  const root = document.documentElement;
  root.setAttribute("data-a11y-font", prefs.fontSize === "normal" ? "" : prefs.fontSize);
  root.setAttribute("data-a11y-contrast", prefs.contrast === "high" ? "high" : "");
  root.setAttribute("data-a11y-underline", prefs.underline === "on" ? "on" : "");
}

export function useA11yPrefs() {
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    applyPrefs(prefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  function update(partial) {
    setPrefs((prev) => ({ ...prev, ...partial }));
  }

  function reset() {
    setPrefs(DEFAULTS);
  }

  return { prefs, update, reset };
}
