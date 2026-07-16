Standardize the two email addresses in the app to a single, correct address and ensure both are clickable mailto links.

1. Findings
- `src/_pb/screens/PrivacyPolicy.jsx:54` already uses `mailto:meimagineai@gmail.com`.
- `src/_pb/screens/AccessibilityStatement.jsx:54` uses `mailto:meimaginai@gmail.com` (typo: missing the second "e").

2. Changes
- Update `AccessibilityStatement.jsx` to point to `mailto:meimagineai@gmail.com` with the same visible text.
- Verify both links remain clickable `<a>` tags with `href="mailto:..."`.
- No other plain-text or unlinked email addresses were found in the source.

3. Files to edit
- `src/_pb/screens/AccessibilityStatement.jsx` (line 54)

4. Validation
- Search the source again to confirm no other email addresses remain unlinked or inconsistent.
- Spot-check the accessibility statement page in the preview to confirm the link is clickable and opens the mail client.