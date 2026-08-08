# Setline 7.0.3 QA checklist

- [x] JavaScript syntax validation
- [x] Manifest and service-worker cache version validation
- [x] Explicit zero-set preservation
- [x] Zero-rep exclusion from XP and coverage
- [x] Rest-only schedule returns a zero streak
- [x] Planned rest maintains an anchored workout streak
- [x] First exercise performance establishes PR baseline without PR XP
- [x] Later improvement creates one PR event
- [x] Completed weekly missions add reward XP once per week
- [x] Changelog marks 7.0.3 as current
- [x] Food lookup uses fields limit, result cap, timeout and AbortController
- [x] Search results remain component state only
- [x] Permanent storage key remains setline-data-v1

A full remote API success test requires internet access. Offline/error paths and static request safeguards were validated locally.


## Setline 7.1 portion tests
- Scan a per-100-g product and confirm 100 g equals the package data.
- Change to 150 g and confirm every nutrient scales by 1.5.
- Change to 1 cup and confirm totals clear until grams per cup is entered.
- Enter grams per cup and confirm calories/macros recalculate live.
- Change amount to 0.5 cup and confirm totals halve.
- Test a product with serving nutrition and confirm 1 serving uses package values.
- Manually edit a macro and confirm later amount changes do not overwrite it.
- Edit a saved 7.1 food and confirm its portion metadata is retained.


## Setline 7.1.1 checks
- [ ] Live scanner uses `getUserMedia` with constrained 1280 × 720 video and no full-resolution file input.
- [ ] Scanner detects only a cropped frame and stops every camera track on close or detection.
- [ ] Slice appears in serving units.
- [ ] `2 slices (56 g)` resolves to 28 g per slice without guessing.
- [ ] Calorie remainder never displays raw floating-point precision.
- [ ] Arnold Press and Dumbbell Lateral Raise appear in local search.
- [ ] Typo `dumbell lateral raise` resolves to Dumbbell Lateral Raise.
- [ ] Offline catalogue contains at least 120 canonical exercises.
- [ ] Carbs and Fat cards have explicit backgrounds and readable contrast in both themes.
- [ ] All metric cards share equal height and bottom-aligned progress bars.
- [ ] Storage key remains `setline-data-v1`.
