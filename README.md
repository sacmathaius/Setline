# Setline 6.6.3

Setline 6.6.3 is a GitHub Pages-ready PWA patch for mixed-unit commercial gyms, preserving the original kg or lb value on every logged set.

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

## 6.6.3 highlights

- Global kg/lb default in Run Setup, Workout, and Profile
- Per-exercise unit memory for mixed commercial-gym machines
- Original unit stored on every set without recalculating completed history
- Machine profiles: free weight, cable, selectorized, Smith, plate-loaded, bodyweight, and custom
- Remembered increments and optional exercise unit locking
- Optional original-plus-converted display
- Normalized mixed-unit volume charts and personal-record comparisons
- Workout CSV export with original unit and normalized kilogram values
- Training Guide explanation for mixed kg/lb logging

## First load and offline use

The app uses pinned React, Material UI, and HTM browser builds. Internet is required on the first load; the service worker then caches them for offline use.

## Limitations

- Data stays local to each browser/device; cloud sync is not included.
- Food and barcode searches require internet access.
- Camera barcode detection depends on browser support.
- Training suggestions are general guidance, not medical advice.


## Mixed-unit training in 6.6.3
- Every set stores its original load and unit (`kg` or `lb`).
- The global unit is only the default for new exercises and normalized charts.
- Exercise-specific unit, machine profile, increment, and lock settings are remembered.
- Completed history is never numerically rewritten during a unit change.
- Workout CSV exports include both the original unit and a normalized kilogram value.
