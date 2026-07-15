import { createServerFn } from "@tanstack/react-start";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

// Schema פשוט: לכל שדה או ערך מחרוזת או null. אין enums מקוננים / bounds.
const nullableString = z.string().nullable();

const ResultSchema = z.object({
  companyName: nullableString,
  whatCompanyDoes: nullableString,
  targetAudience: nullableString,
  companyStage: nullableString,
  market: nullableString,
  corePain: nullableString,
  solution: nullableString,
  businessGoal: nullableString,
  channels: nullableString,
  language: nullableString,
  tone: nullableString,
});

const SYSTEM = `אתה עוזר שמנתח תיאור עסק בעברית ומחלץ ממנו שדות פרופיל.
החזר JSON בלבד לפי הסכמה. כל שדה חייב להיות מחרוזת (הערך שזוהה) או null אם לא זוהה.
אל תמציא נתונים — אם שדה לא נאמר בטקסט או לא ניתן להסיק ממנו, החזר null.
שדות:
- companyName: שם החברה/העסק
- whatCompanyDoes: מה החברה עושה בקצרה
- targetAudience: קהל היעד
- companyStage: שלב החברה (למשל: seed, pre-seed, growth)
- market: השוק בו החברה פועלת
- corePain: הכאב המרכזי שהחברה פותרת
- solution: הפתרון שהחברה מציעה
- businessGoal: המטרה העסקית המרכזית
- channels: ערוצי שיווק/הפצה
- language: שפת פעילות ("עברית" אם לא צוין אחרת)
- tone: טון הדיבור של המותג`;

export const analyzeProfileWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ text: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const model = gateway("google/gemini-3-flash-preview");

    try {
      const { output } = await generateText({
        model,
        system: SYSTEM,
        prompt: `נתח את התיאור העסקי הבא וחלץ ממנו את שדות הפרופיל:\n\n${data.text}`,
        output: Output.object({ schema: ResultSchema }),
      });
      return { ok: true as const, fields: output };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        // ננסה לפרק את הטקסט הגולמי כ-JSON כגיבוי לפני שנוותר
        try {
          const raw = (error as { text?: string }).text ?? "";
          const match = raw.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            const partial: Record<string, string | null> = {};
            for (const key of Object.keys(ResultSchema.shape)) {
              const v = parsed?.[key];
              partial[key] = typeof v === "string" && v.trim() ? v : null;
            }
            return { ok: true as const, fields: partial as z.infer<typeof ResultSchema> };
          }
        } catch {
          // נופלים לשגיאה למטה
        }
        return { ok: false as const, error: "לא הצלחנו לנתח את הטקסט. נסו טקסט מפורט יותר." };
      }
      const message = error instanceof Error ? error.message : String(error);
      // detect rate/credit issues
      if (/429|rate/i.test(message)) {
        return { ok: false as const, error: "עומס זמני על שירות ה-AI, נסו שוב בעוד רגע." };
      }
      if (/402|credit|payment/i.test(message)) {
        return { ok: false as const, error: "נגמרו הקרדיטים ל-AI. יש להוסיף קרדיטים בהגדרות הפרויקט." };
      }
      throw error;
    }
  });
