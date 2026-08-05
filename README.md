# Setline PWA v6.5.2

## What changed
- Added a real weekly training calendar with Push, Pull, Legs, Upper, Lower, Full Body, Custom, Deload, Rest and Active Recovery plans.
- Added per-date plan editing from Home and a default weekly template in Profile.
- Added optional automatic forward-shifting when yesterday's planned training was missed.
- Planned Rest and Active Recovery days now count as following the schedule and do not create false missed-workout warnings.
- Added a recovery check-in for sleep, soreness, energy and stress, with neutral training guidance rather than medical claims.
- Refreshed the dark UI with cleaner cards, spacing, type hierarchy and touch targets.
- Added fluid sizing and safe-area support for iPhone 16 Pro, Galaxy S24 and smaller phone widths.
- Kept the permanent `setline-data-v1` key and upgraded non-destructively to schema 5.

## Update GitHub Pages
1. Export a backup from Setline.
2. Unzip this package.
3. Replace every file in the GitHub repository root with the files inside this folder.
4. Commit the update and wait for GitHub Pages to redeploy.
5. Open the website once in the browser. Use Setline's **Update** banner if the installed PWA still shows the old version.

## Data safety
- Existing workouts, nutrition, profiles, meal templates and habit data remain under the same permanent storage key.
- A migration snapshot is created before schema 5 is written.
- Repository updates do not erase browser data. Clearing browser/site data or uninstalling with storage removal can still remove local records, so keep exported backups.

## Planning behaviour
- Rest and Active Recovery are treated as successful planned days.
- Deload is still treated as a training day, but the app recommends reduced load or volume.
- Automatic missed-day shifting runs once per calendar day and can be disabled in Profile.
- Recovery status is a simple personal check-in and is not a medical or injury assessment.
