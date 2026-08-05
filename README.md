# Setline PWA v6.5.3

## What changed
- Refreshed the interface with a deeper navy-black theme, slate surfaces, cobalt actions, amber streak accents and mint success feedback.
- Rebuilt logging feedback as a responsive card so long messages wrap instead of clipping.
- Added an original Setline workout-completion streak moment with a flame animation, count-up, glow and optional device vibration.
- Made the workout-completion dialog scroll-safe on short screens and safe-area aware on iPhone and Android.
- Added a compact readiness score derived from the user's recovery check-in, with neutral Normal / Reduce / Recover guidance.
- Added Profile reliability tools: connection status, manual update check, local data integrity check and non-destructive automatic-backup merge.
- Kept the permanent `setline-data-v1` storage key and schema 5; this visual update does not rename or reset user data.

## Update GitHub Pages
1. Export a backup from Setline.
2. Unzip this package.
3. Replace every file in the GitHub repository root with the files inside this folder.
4. Commit the update and wait for GitHub Pages to redeploy.
5. Open the website once in the browser. Tap Setline's **Update** banner if the installed PWA still shows the old version.

## Data safety
- Existing workouts, nutrition, profiles, schedules, meal templates and habit data remain under the same permanent storage key.
- Repository updates do not erase browser storage.
- The automatic-backup merge adds missing records without deliberately deleting current records.
- Keep exported backups before clearing site data, uninstalling with storage removal, or changing phones.

## Guidance limits
- The readiness score is a simple personal training guide based on sleep, soreness, energy and stress entries.
- It is not a medical, injury or recovery diagnosis.
