---
version: 1
slug: "src-pb-screens-home-jsx"
primary_target: "src/_pb/screens/Home.jsx"
related_targets: ["src/_pb/components/Layout.jsx"]
---

Scope: home screen of the prompt book (src/_pb/screens/Home.jsx) plus the app shell (Layout: sidebar → top bar). Mode: Operate.
Audience: team members returning after a BOOST ME AI training; job: find the prompt for today's task and get it filled from their business profile.
Constraints: BOOST ME DESIGN.md world is binding; all functions, routes, analytics events, storage and copy preserved; a11y toolbar and high-contrast mode keep working.

## Direction contract

THESIS: The home is an open book on the plum desk: the right page is the table of contents, the left page shows the chosen prompt already filled from your business. Refuses the category default: a grid of identical icon cards with "open" buttons.

OWN-WORLD: Plum desk (#2B1A2E) as a slim top bar and page ground; two cream sheets (#FFF8F0 contents, #F7EBDD preview slip rotated +0.6deg) with long plum shadows; 2px ink rules open each chapter, 1px faint rules between rows; profile-filled blanks marked with the orange→magenta highlighter swipe, missing blanks underlined in magenta pen; one filled action in magenta-deep; Rubik 400–900.

STORY: The returning member sees all 20 prompts as four chapters, picks a row, instantly sees their own company in the prompt, and goes to fill and copy.

FIRST VIEWPORT: Top bar (robot + "ספר פרומפטים חכם" + nav as text tabs). Below, right page ~58%: H1 900 "ספר הפרומפטים שלך", profile line, topic chapters with ruled rows (title 800, output soft, "9/11 מהעסק שלך"). Left page ~42%, sticky: selected prompt title, AI role, the template excerpt with filled/missing blanks marked, primary "למילוי והעתקה" at its foot.

FORM: Two-page spread (open book), position 4 on the ordered list, seed key f9f97cb6.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
