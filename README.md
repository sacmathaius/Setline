# Setline 6.6

Setline 6.6 is a GitHub Pages-ready React + Material UI PWA rebuild.

## Publish the update

1. Open the current Setline app and export a backup from **Profile → Data and reliability**.
2. Unzip this package.
3. In the GitHub `Setline` repository, upload **all files inside this folder** to the repository root.
4. Replace files with matching names and commit directly to `main`.
5. Wait for GitHub Pages to deploy, then open the website once in the browser and refresh.
6. Reopen the installed app. Use the in-app **Update** button when it appears.

Do not upload the ZIP itself and do not place the files inside another folder.

## Data safety

- Setline continues to use the permanent `setline-data-v1` browser-storage key.
- Version 6.6 creates `setline-pre-v6.6-backup` before migration.
- Each normal save copies the previous state to `setline-data-last-good-v1`.
- An unexpected empty-state overwrite is blocked when existing records are detected.
- Updating GitHub files does not itself remove browser data.
- Exported JSON backups can be merged back into the app.

## First load and offline use

The interface uses pinned React, Material UI and HTM browser builds from `unpkg.com`. Internet is required the first time 6.6 loads. The service worker caches those dependencies for later offline use.

## Main features

- Light, dark and system themes
- Mobile and desktop Material UI layouts
- Fast set logging with previous-performance prefilling
- RIR, RPE, AMRAP, drop-set and training-term guide
- Rest, active-recovery and deload scheduling
- Recovery check-ins and readiness guidance
- Weekly muscle-region coaching report
- Nutrition by meal, favourites, recent foods, templates and barcode lookup
- Progress charts, personal records, bodyweight and consistency calendar
- Onboarding, changelog, backups and data-integrity tools

## Limitations

- Data remains local to each browser/device; accounts and cloud sync are not included.
- Food and barcode searches require internet access and use Open Food Facts.
- Camera barcode detection depends on browser support.
- Training recommendations are general guidance, not medical advice.
