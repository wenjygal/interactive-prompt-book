// עטיפה קלה ל-GA4. אם לא הוגדר Measurement ID (או ש-gtag לא נטען), הפונקציה לא עושה כלום —
// כך שהאירועים מוכנים לחיווט מיידי ברגע שיוגדר חשבון GA4 אמיתי.
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
