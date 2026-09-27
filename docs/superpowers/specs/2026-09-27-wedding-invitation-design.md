# Wedding Invitation Website Design

## Goal

Create a polished, responsive single-page wedding website for Phạm Nguyễn Linh Đan and Lê Đàm Duy Phúc. The visual language translates the supplied printed invitation into a cinematic editorial web experience rather than reproducing the cards literally. All visitor-facing copy, navigation, form feedback, and date formatting use Vietnamese.

## Visual Direction

The site uses warm ivory backgrounds, burgundy typography, champagne-gold accents, fine botanical line art, dotted rules, scalloped frames, and generous negative space. Display names and section flourishes use an elegant calligraphic typeface; supporting copy uses a formal high-contrast serif. Decorations remain pale enough to preserve legibility.

The mobile-first layout expands into spacious editorial compositions on larger screens. A full-height hero, layered photography, oversized typography, and refined section transitions create a grand visual impression without obscuring the invitation details.

Animation remains restrained: gentle entrance transitions, subtle botanical movement, and a live countdown. Reduced-motion preferences disable nonessential movement.

## Page Structure

1. **Hero** — couple names, wedding date, floral framing, and a clear invitation cue.
2. **Welcome** — a formal invitation message and interlocking-rings motif.
3. **Couple story** — concise placeholder milestones with an image slot.
4. **Countdown** — days, hours, minutes, and seconds until 6 December 2026.
5. **Events** — ceremony at 09:00, guest reception at 11:00, and banquet at 12:00, using the supplied family and venue details.
6. **Gallery** — a responsive editorial image grid driven entirely by content configuration. Empty image paths show refined neutral placeholders.
7. **Location** — Minh Toàn Galaxy Hotel, Sảnh Venus – Tầng 2, Đà Nẵng, with an external map action.
8. **RSVP** — an accessible front-end form with a clear local success state. No persistence or backend is implied.
9. **Closing** — a thank-you message, names, and date.

## Wedding Details

- Couple: Phạm Nguyễn Linh Đan and Lê Đàm Duy Phúc
- Wedding date: 06/12/2026
- Ceremony: 09:00
- Guest reception: 11:00
- Banquet: 12:00
- Venue: Minh Toàn Galaxy Hotel, Sảnh Venus – Tầng 2, Đà Nẵng
- Groom's family: Lê Đàm Duy Minh and Trần Thị Đức Hạnh, phường Hòa Cường, Đà Nẵng
- Bride's family: Phạm Đình Toàn and Nguyễn Thị Hồng Nhung, phường Tam Hiệp, Đồng Nai

## Content and Image Ownership

All replaceable Vietnamese content lives in one `src/content.ts` module, including names, dates, family details, story text, event information, links, form labels, and every image path. `App.vue` consumes that object and does not embed replaceable image URLs.

Image paths default to empty strings. Empty paths deliberately render styled placeholders instead of broken-image icons, allowing real couple photography to be added later without layout changes. The exact street address and map URL are editable content fields and may initially contain clearly labeled placeholder values if the reference does not provide them.

## Architecture

The existing Vue 3 and Vite application remains dependency-light:

- `src/App.vue` owns page composition and small interactions.
- `src/content.ts` owns editable content and image paths.
- `src/styles.css` owns global visual styling and responsive behavior.
- Reusable components are introduced only when a repeated unit has meaningful behavior; otherwise semantic sections remain in `App.vue`.

No backend, form persistence, router, animation library, icon package, or state-management package is added.

## Behavior and Accessibility

- Navigation links scroll to major sections.
- The countdown derives from the configured ISO date, updates once per second, and safely stops at zero.
- RSVP uses browser-native required-field validation and shows an in-page confirmation after submission.
- Map navigation opens the configured external URL in a new tab.
- Semantic landmarks, visible keyboard focus, descriptive labels, sufficient contrast, and responsive sizing are required.
- Missing images never render broken-image icons.
- Motion is decorative rather than necessary; reduced-motion mode removes smooth scrolling and nonessential transitions.

## Verification

- Run Biome checks.
- Run Vue type checking and the production build.
- Render and inspect representative desktop and mobile layouts.
- Inspect empty-image placeholders and the RSVP confirmation state.
- Confirm there is no horizontal overflow.
- Confirm reduced-motion behavior is represented in the stylesheet and does not hide content.
