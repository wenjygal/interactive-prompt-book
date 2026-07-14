import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HELOW WORLD - עמוד נחיתה" },
      { name: "description", content: "עמוד נחיתה מינימליסטי ומודרני" },
      { property: "og:title", content: "HELOW WORLD" },
      { property: "og:description", content: "עמוד נחיתה מינימליסטי ומודרני" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center"
    >
      <div className="relative">
        <div className="absolute -inset-20 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            ברוכים הבאים
          </p>
          <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-8xl md:text-9xl">
            HELOW WORLD
          </h1>
        </div>
      </div>
      <p className="mt-8 max-w-lg text-lg text-muted-foreground">
        זהו עמוד נחיתה פשוט, נקי ומודרני בעברית.
      </p>
      <a
        href="mailto:hello@example.com"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90"
      >
        צרו קשר
      </a>
    </div>
  );
}
