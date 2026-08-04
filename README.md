# Setline PWA v6.5.1

## What changed
- Added favourites, recent foods and saved meal templates for faster nutrition logging.
- Added serving units with editable grams per serving, piece, cup, scoop or can.
- Added manual macro entry, quick-add nutrition, custom foods and recipes.
- Added Open Food Facts barcode lookup and camera scanning where the browser supports it.
- Added meal sections plus daily protein remaining and seven-day calorie/protein averages.
- Added an optional private habit counter in Profile with a hidden-count mode.
- Added a subtle streak-flame animation, save confirmation animation and workout-completion summary.
- Kept the permanent `setline-data-v1` storage key and added a schema-4 migration snapshot.

## Update GitHub Pages
1. Export a backup from the current app.
2. Unzip this package.
3. Replace every file in the GitHub repository root with the files inside this folder.
4. Commit the update and wait for GitHub Pages to redeploy.
5. Open the website once in the browser and use the in-app **Update** button if the installed PWA still shows the old version.

## Notes
- Existing workout and nutrition records remain under the same permanent storage key.
- Camera barcode scanning depends on browser support and camera permission. Manual barcode lookup is always available.
- Food-database values may be incomplete; verify branded products against their package labels.
- The private habit counter is neutral, optional and stored only in the local Setline data.
