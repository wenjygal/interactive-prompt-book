import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ספר פרומפטים חכם" },
      { name: "description", content: "ספר פרומפטים חכם לעסקים - יצירה, ניהול ושיתוף פרומפטים מותאמים אישית" },
      { property: "og:title", content: "ספר פרומפטים חכם" },
      { property: "og:description", content: "ספר פרומפטים חכם לעסקים" },
    ],
  }),
  component: Index,
  ssr: false,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  const [Content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    (async () => {
      const [{ HashRouter }, appMod] = await Promise.all([
        import("react-router-dom"),
        // @ts-expect-error - JSX module without types
        import("../_pb/App.jsx"),
      ]);
      const App = appMod.default;
      await import("../_pb/index.css");
      setContent(
        <HashRouter>
          <App />
        </HashRouter>
      );
      setMounted(true);
    })();
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "100vh" }} />;
  }
  return <>{Content}</>;
}
