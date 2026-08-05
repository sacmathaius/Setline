# Setline 6.6.1

Setline 6.6.1 is a GitHub Pages-ready PWA patch for the React + Material UI rebuild.

## Publish the update

1. Open Setline and export a backup from **Profile → Data and reliability**.
2. Unzip this package.
3. Upload **all files inside this folder** to the root of the GitHub `Setline` repository.
4. Replace matching files and commit to `main`.
5. Wait for GitHub Pages to deploy, open the website in the browser, and refresh once.
6. Reopen the installed app and use the **Update** banner when it appears.

Do not upload the ZIP itself or place these files inside another folder.

## Data safety

- The permanent storage key remains `setline-data-v1`.
- Updating GitHub files does not delete browser storage.
- Normal saves keep a last-good backup.
- Exported JSON backups can be merged into the app.

## 6.6.1 highlights

- Fixed Profile, Progress, Nutrition, and bottom-navigation clipping
- Tappable Home metrics with quick actions and detail sheets
- Seven-day mini trends and customizable Home card order
- Push, Pull, Legs, Upper, Lower, and Full Body starter workouts
- Random built-in streak Easter-egg messages
- Light, dark, and system themes retained

## First load and offline use

The app uses pinned React, Material UI, and HTM browser builds. Internet is required on the first load; the service worker then caches them for offline use.

## Limitations

- Data stays local to each browser/device; cloud sync is not included.
- Food and barcode searches require internet access.
- Camera barcode detection depends on browser support.
- Training suggestions are general guidance, not medical advice.
