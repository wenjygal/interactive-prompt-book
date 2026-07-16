import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://boost-me-interactive-prompt-book.lovable.app/" }],
    meta: [
      { property: "og:url", content: "https://boost-me-interactive-prompt-book.lovable.app/" },
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
