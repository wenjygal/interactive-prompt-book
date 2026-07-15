import { createServerFn } from "@tanstack/react-start";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const FieldSchema = z
  .object({
    value: z.string().nullable(),
    confidence: z.enum(["high", "low", "none"]),
  })
  .nullable();

const ResultSchema = z.object({
  companyName: FieldSchema,
  whatCompanyDoes: FieldSchema,
  targetAudience: FieldSchema,
  companyStage: FieldSchema,
  market: FieldSchema,
  corePain: FieldSchema,
  solution: FieldSchema,
  businessGoal: FieldSchema,
  channels: FieldSchema,
  language: FieldSchema,
  tone: FieldSchema,
});

const SYSTEM = `אתה עוזר שמנתח תיאור עסק בעברית ומחלץ ממנו שדות פרופיל.
החזר JSON בלבד לפי הסכמה. אל תמציא נתונים — אם שדה לא מופיע בטקסט, החזר null.
confidence "high" = הערך נאמר במפורש בטקסט. "low" = הסקת מסקנה עקיפה. "none" = לא זוהה (החזר null במקרה זה).`;

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
