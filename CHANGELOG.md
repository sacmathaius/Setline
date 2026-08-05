# Changelog

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
