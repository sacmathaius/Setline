# Setline 7.1.1 QA report

## Result

**44 of 44 automated package and logic checks passed.**

## Passed checks

- JavaScript syntax for `app.js` and `sw.js`.
- Required PWA files, manifest, icons, and 7.1.1 cache names.
- Permanent storage key remains `setline-data-v1`.
- Barcode scanner now uses a constrained rear-camera stream with a cropped scan frame capped near 960 × 540.
- Full-resolution photo capture and `createImageBitmap(file)` scanning were removed.
- Camera tracks, scan timers, canvas buffers, and video sources are cleaned up on close or successful detection.
- `slice` appears as a serving unit.
- Explicit package text such as `2 slices (56 g)` resolves to 28 g per slice.
- Portion calculations scale from the immutable per-100-g basis.
- Missing serving conversions remain blocked rather than guessed.
- Calorie remainders are rounded before display; raw JavaScript floating-point values no longer reach Home.
- Offline catalogue contains 129 canonical exercises.
- Arnold Press and Dumbbell Lateral Raise are present.
- Alias `dumbell lateral raise` resolves to Dumbbell Lateral Raise.
- Seated Leg Curl maps to hamstrings and a selectorized machine.
- Custom exercise names remain available.
- Carbs and Fat cards have explicit backgrounds, readable contrast, equal card layout, and bottom-aligned progress bars.

## Device-only validation still required

A real Android/iPhone camera feed cannot be opened in this build environment. Before publishing to `main`, test camera permission, live detection, cancel/reopen, and repeated scans on the Galaxy S24 and at least one iPhone. Barcode lookup also requires a live internet connection.
