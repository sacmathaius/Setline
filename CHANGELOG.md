# Setline changelog

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
