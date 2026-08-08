# Setline 7.1.1 — Hardening, scanner and catalogue update

- Replaced full-resolution photo barcode capture with a low-memory live camera scanner using a constrained stream and cropped scan frame.
- Added `slice` as a serving unit. Explicit package labels such as `2 slices (56 g)` become `28 g per slice`; Setline does not guess missing conversions.
- Fixed raw floating-point calorie remainders and standardized calorie/macro display rounding.
- Expanded the offline exercise catalogue to more than 120 canonical movements, including Arnold Press and Dumbbell Lateral Raise.
- Added aliases and typo-tolerant exercise search while retaining custom exercise entry.
- Fixed Carbs/Fat card backgrounds, text contrast, equal heights, baselines, and progress-bar alignment in both themes.
- Retained the permanent `setline-data-v1` storage key and every 7.1 reliability fix.

---

# Setline 7.1 — Serving-aware nutrition

- Barcode nutrition scales to the actual entered portion.
- Scanned per-100-g values remain immutable and are used as the calculation basis.
- Amount and unit changes update calories, protein, carbs, and fat live.
- Package serving size and serving nutrition are used when available.
- Cup, piece, scoop, can, millilitre, and unknown serving units require a gram equivalent instead of guessing.
- Manual nutrition edits disable automatic scaling to protect user-entered values.
- Includes every Setline 7.0.3 reliability fix.

---

# Setline 7.0.3 — Reliability patch

- Reduced nutrition-search memory use by requesting only required Open Food Facts fields and keeping no more than nine temporary results.
- Added cancellation, eight-second timeouts, exact lookup errors and copyable diagnostics.
- Weekly mission rewards now contribute to XP once per completed week.
- PR XP now requires beating a previous logged performance; first-time exercises establish a baseline only.
- Rest days maintain an existing streak but cannot create a streak without completed training.
- Explicit zero-set and zero-rep records no longer affect XP, mastery, missions or muscle coverage.
- Fixed changelog ordering, schedule arrow direction and Profile equipment/movement selectors.
- The permanent storage key remains `setline-data-v1`; migration does not rewrite mixed kg/lb history.

# Setline changelog

## 7.0.2 — August 8, 2026

### New
- Run Setup weekly preview lets you move any day to a different slot with arrow controls before finishing setup, instead of only reassigning splits afterward in Profile → Schedule.
- Reset order action returns the preview to the auto-generated split sequence.

### Improved
- Changing training split or training days in the wizard now resets any manual day reorder, so the preview never shows a stale arrangement.

### Data safety
- Permanent `setline-data-v1` storage key retained; this release only changes the Run Setup wizard UI.

## 7.0.1 — Editorial visual update

### New
- Warm off-white and charcoal themes based on a clean editorial/Figma-style system.
- Modular pastel tiles for Home metrics, today plan, XP, recovery and weekly focus.
- Inter Tight typography with simpler black-and-white controls.

### Improved
- Reduced Material-style chrome, shadows and oversized containers.
- More compact workout, nutrition, progress and profile surfaces.
- Same features, records and permanent `setline-data-v1` key.

## 7.0.0 — August 7, 2026

### New
- Custom compact Setline interface inspired by serious training tools rather than oversized dashboard cards.
- Workout Focus Mode with previous performance, load, reps, RIR, Done and Remove controls.
- Setline XP, levels and ranks based on completed training, consistency, recovery and personal records.
- Weekly missions, exercise mastery tiers, milestone map and Comeback Mode.

### Improved
- Dark theme uses near-black surfaces, white text, one blue action accent and restrained amber/green states.
- Progress page combines serious analytics with optional progression rewards.
- Workout completion now shows the XP earned for the session.

### Data safety
- Permanent `setline-data-v1` storage key retained.
- Schema 9 migration adds progression settings only; workout, nutrition and mixed-unit history are not rewritten.

## 6.6.4 — August 7, 2026

### Fixed
- Leg Curl now maps to hamstrings with calf assistance instead of biceps and forearms.
- Known machine exercises receive sensible equipment defaults when an old automatic free-weight default was stored.
- Food search labels and outlined-field notches no longer cut through text.
- The mobile food form scrolls above the keyboard and keeps Save/Cancel reachable.

### Improved
- Compact, minimal visual density with smaller typography, card padding, radii, and controls.
- Every exercise displays an immediate kg/lb segmented toggle; automatic unit locking was removed.
- Completed set history remains unchanged when the exercise unit changes.
- Every set has a visible remove control beside Done.
- Generic foods such as boiled eggs are available through local presets; packaged foods remain available online.

### Data safety
- Permanent storage key remains `setline-data-v1`.
- Migration changes metadata and interface defaults only; completed load values and units are not rewritten.

## 6.6.3 — August 6, 2026

### New
- Per-exercise kg/lb selection with remembered settings.
- Machine profiles and configurable load increments.
- Unit locking and optional converted-value display.
- Workout CSV export with original unit and normalized kilogram values.

### Improved
- Volume charts and personal records compare mixed-unit training in a normalized display unit.
- Previous-set summaries display the original unit used.

### Data safety
- Migration adds unit metadata only; it does not recalculate or rewrite existing load numbers.
- The permanent `setline-data-v1` storage key remains unchanged.

## 6.6.2 — August 5, 2026

### Fixed
- Training days in Run Setup now save as an independent 1–7 value instead of being inferred from the seven-day calendar
- Generated weekly plans contain exactly the selected number of training days

### New
- Professional eight-step Run Setup with progress, previews and safer controls
- Equipment selection cards and movement-to-avoid chips with an optional note
- PPL + Upper/Lower and Bro Split options
- Chest, Back, Shoulders and Arms session types with starter exercises
- Full split explanations in the Training Guide, including recommended days, advantages, drawbacks and examples
- Streak Easter eggs now show named attribution using public-domain quotations

### Improved
- Continuously animated streak flame with stronger milestone effects
- Unified page, card, drawer, button, list and theme motion
- Reduced Motion continues to suppress nonessential animation

### Reliability
- Permanent `setline-data-v1` storage key retained
- Run Setup never removes workout, nutrition or progress history
- New service-worker cache name forces installed PWAs to receive the patch

## 6.6.1 — August 5, 2026

### Fixed
- Added consistent spacing between Profile cards and more room around Daily Targets fields
- Added enough bottom clearance so Private Habit and other content stay above phone navigation
- Prevented the Progress report date control from covering report content
- Rebuilt nutrition rows so long food names, calories, and edit/delete actions stay aligned
- Reduced excessive height and rounded-pill appearance in Action Plan cards

### New
- Home calories, protein, readiness, and bodyweight cards now open useful bottom-sheet details
- Seven-day mini trends on Home metric cards
- Home cards can be reordered or hidden from the Customize menu
- Tapping the streak reveals a different built-in Setline Easter-egg message
- Push, Pull, Legs, Upper, Lower, and Full Body starter templates
- Upper and Lower exercise suggestions in the add-exercise dialog

### Reliability
- Continues using the permanent `setline-data-v1` storage key
- Existing 6.6 and earlier data is normalized without replacement
- New service-worker cache name forces GitHub Pages installations to receive the patch

## 6.6.0 — August 5, 2026

### New
- React and Material UI interface rebuild
- Light, dark and system appearance modes
- Guided onboarding and weekly program setup
- Searchable Training Guide for RIR, RPE, AMRAP, drop sets, failure, supersets and deloads
- Explainable weekly muscle-region coaching report
- Unified progress hub and full in-app changelog

### Reliability
- Permanent `setline-data-v1` storage key retained
- Pre-migration backup, last-good backup and empty-overwrite guard
- Import merges records rather than replacing them
