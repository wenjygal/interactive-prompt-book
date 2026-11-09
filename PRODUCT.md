# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: members of a team who went through a BOOST ME AI training (the "מאפס לצוות" Zoom session) and come back to the tool to do real work with AI. Hebrew speakers, not prompt engineers. They arrive with a concrete business task (a brand book, a value proposition, an investor one-liner, a sales message) and want a good prompt for it without learning prompt writing.

The current content set is written for startup teams (company stage Pre-Seed / Seed / Series A, fundraising prompts).

## Product Purpose

A prompt book that writes the prompt for you: pick a prompt from 20 ready ones in four topics, fill its fields (many filled automatically from a saved business profile), and copy a complete prompt into any AI tool. Success = a returning team member leaves with a filled, ready-to-paste prompt for the task in front of them.

## Positioning

Not a prompt library to read: every prompt is a template whose blanks are filled from the user's own business profile, so the output is specific to their company. A free tool by BOOST ME that proves capability by being genuinely useful; it does not sell inside the product.

## Operating Context

Flow: home (choose topic and prompt) → prompt editor (fields with states: confirmed / suggested / predicted / empty, live preview of the full prompt) → copy, save as file, or save to "השמורים שלי". Business profile (11 fields) can be filled manually or by "ניתוח" (analyze) from pasted text. Data lives in the browser (localStorage). Built in Lovable (React + TanStack Start), repo synced to Lovable on `main`.

## Capabilities and Constraints

- Screens: ספר הפרומפטים (home), פרופיל העסק, ניתוח, השמורים שלי, הגדרות, הצהרת נגישות, מדיניות פרטיות
- Four topics: שיווק, מכירות, גיוס משקיעים, שיפור וחידוד. 20 prompts
- All functionality, routes, analytics events, storage keys and copy stay as they are in a visual redesign
- Built-in accessibility toolbar (font size, high contrast, underline links) must keep working, including its high-contrast override

## Brand Commitments

- Part of BOOST ME. Visual world is binding: BOOST ME design system (vault `BOOST ME — DESIGN.md`, derived from boost-me.digital): plum ground, cream paper, ink rules, magenta pen, orange stamp, Rubik only, RTL
- BOOST ME speaks as אנחנו in feminine plural; visitor address is gender-neutral singular (decision 2026-11-08). The tool's existing copy is not rewritten in a visual pass
- No em/en dashes in Hebrew copy

## Evidence on Hand

20 real prompts in `src/_pb/data/promptsCatalog.js`, 11 profile fields in `src/_pb/data/profileFields.js`, logos in `public/assets/`. No usage numbers, testimonials or customer names exist; none may be invented.

## Product Principles

1. The task leads: the user should see what they can make before how the tool works.
2. Their business, not a template: the profile filling the blanks is the product's point and should be visible.
3. Useful first: a free tool earns trust by finishing the job, no sales detours.
4. Calm for returning users: fast to find the prompt they used last time.

## Accessibility & Inclusion

Israeli accessibility law (ת"י 5568 / WCAG AA). Hebrew RTL. Keyboard navigation, visible focus, reduced motion, and the in-app accessibility toolbar.
