# Setline 6.6.2

Setline 6.6.2 is a GitHub Pages-ready PWA patch focused on professional onboarding, training-split support, streak presentation, and motion.

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
- Run Setup changes the profile and weekly plan only; it does not delete workout or nutrition history.
- Training days are stored independently from the seven-day plan.
- Normal saves keep a last-good backup.
- Exported JSON backups can be merged into the app.

## 6.6.2 highlights

- Fixed training-days selection so 1–7 remains exactly as selected
- Professional eight-step Run Setup wizard
- Selectable equipment and movement-to-avoid options
- Full Body, Upper/Lower, PPL, PPL + Upper/Lower, Bro Split, and Custom options
- Exact weekly schedule preview and split mismatch warnings
- Training Guide explanations for every split
- Attributed public-domain streak Easter eggs and a continuously animated flame
- Unified fluid transitions with reduced-motion support

## First load and offline use

The app uses pinned React, Material UI, and HTM browser builds. Internet is required on the first load; the service worker then caches them for offline use.

## Limitations

- Data stays local to each browser/device; cloud sync is not included.
- Food and barcode searches require internet access.
- Camera barcode detection depends on browser support.
- Training suggestions are general guidance, not medical advice.
