# החלפת ניתוח הפרופיל בניתוח AI אמיתי

## הבעיה
הפונקציה `analyzeProfileText` ב־`src/_pb/lib/profileParser.js` היום היא רק Regex שמחפש שורות בסגנון "שם החברה: ...". על תיאור עסק חופשי בעברית היא כמעט לא מזהה כלום — ולכן נראה שה"AI לא עובד". בפועל אין שם קריאת AI בכלל.

## הפתרון
להוסיף server function שקוראת ל־Lovable AI (Gemini) עם schema מובנה שמחזירה את 11 שדות הפרופיל, ולחבר אותה במקום הפרסר הרגקסי גם ב־`Profile.jsx` וגם ב־`Analyze.jsx`.

## שלבים

1. **הפעלת Lovable Cloud** (חובה כדי לקבל `LOVABLE_API_KEY` בשרת). זה נדרש פעם אחת.

2. **יצירת server function** ב־`src/lib/analyze-profile.functions.ts`:
   - `createServerFn({ method: "POST" })` שמקבל `{ text: string }`.
   - קורא ל־`google/gemini-3-flash-preview` דרך `@ai-sdk/openai-compatible` + `Lovable-API-Key` header.
   - משתמש ב־`Output.object` עם Zod schema של 11 השדות (companyName, whatCompanyDoes, targetAudience, companyStage, market, corePain, solution, businessGoal, channels, language, tone) — כל שדה `string | null`.
   - מחזיר גם רמת ודאות פר־שדה (`suggested` אם זוהה במפורש בטקסט, `predicted` אם נגזר בעקיפין).

3. **חיבור לצד הלקוח**:
   - ב־`src/_pb/lib/profileParser.js` להוסיף `analyzeProfileTextAI(text)` שמייבא את ה־server fn ב־dynamic import ומחזיר אותו פורמט שהקוד הקיים מצפה לו (`{ [key]: { value, status } }`).
   - להשאיר את הפונקציה הרגקסית כ־fallback מיידי אם ה־AI נכשל.
   - `analyzeProfileCsv` נשאר כמו שהוא (CSV אמיתי לא צריך AI).

4. **עדכון המסכים**:
   - `Profile.jsx` — `handleAnalyze` ו־`handleFile` (לא CSV) נעשים async, מציגים spinner בזמן הקריאה, ומראים toast על שגיאה (למשל 402/429 מה־gateway).
   - `Analyze.jsx` (DescriptionMode) — אותו דבר: כפתור "נתח" הופך ל־async עם מצב טעינה.

5. **טיפול בשגיאות**:
   - `429` → toast: "עומס זמני, נסו שוב בעוד רגע".
   - `402` → toast: "נגמרו הקרדיטים ל־AI — יש להוסיף קרדיטים בהגדרות".
   - כל שגיאה אחרת → נופלים ל־parser הרגקסי הישן וממשיכים.

## פרטים טכניים

- Server function חיה תחת `src/lib/` (client-safe path), לא תחת `src/server/`.
- `process.env.LOVABLE_API_KEY` נקרא רק בתוך `.handler()`.
- אין שינוי ב־storage / במבנה הפרופיל — רק המקור של ההצעות משתנה.
- אין שינוי ב־UI/עיצוב מעבר להוספת מצב טעינה בכפתור "נתח".

## קבצים שישתנו
- **חדש**: `src/lib/analyze-profile.functions.ts`
- `src/_pb/lib/profileParser.js` — הוספת `analyzeProfileTextAI`
- `src/_pb/screens/Profile.jsx` — async analyze + loading state
- `src/_pb/screens/Analyze.jsx` — async analyze + loading state
