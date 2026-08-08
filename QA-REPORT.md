# Setline 7.1 QA report

## Passed checks
- JavaScript syntax validation.
- Required PWA files and icon assets present.
- Service-worker cache version updated to 7.1.
- App title, current version, manifest description, README, and changelog updated.
- Open Food Facts requests include serving-size, serving-quantity, serving-unit, and serving nutrient fields.
- Scanned nutrition keeps a per-100-g basis separate from displayed portion totals.
- 100 g remains equal to the barcode data.
- 150 g scales all nutrients by 1.5.
- Selecting cup without a gram equivalent clears stale totals and blocks saving.
- 1 cup at 195 g correctly scales a 356 kcal/100 g product to 694.2 kcal.
- 0.5 cup correctly halves the calculated totals.
- Product-provided serving nutrition scales by serving count.
- Manual macro edits remain untouched and disable automatic scaling.
- Existing storage key remains `setline-data-v1`; no workout or nutrition history rewrite was introduced.

## Limitation
A live successful Open Food Facts response and full rendered browser test were not available in the build environment. Network timeout, cancellation, field-selection, calculation, syntax, and package-integrity paths were tested locally.
