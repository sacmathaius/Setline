# Setline 6.6.4

Setline 6.6.4 is a compact reliability patch focused on fast workout logging, correct exercise metadata, and a keyboard-safe nutrition flow.

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

## 6.6.4 highlights

- Compact minimal interface with reduced card padding, headings, radius, and visual weight
- Clear kg/lb segmented toggle on every exercise; no automatic unit locking
- Completed sets retain their original unit while incomplete sets can follow a new unit
- Per-set remove button beside the completion button
- Exact exercise definitions fix Leg Curl muscle and equipment metadata
- Common-food presets, including boiled eggs, work without packaged-food search
- Mobile food entry expands to a keyboard-safe full-screen form
- Floating input labels receive corrected spacing and notch sizing

## First load and offline use

The app uses pinned React, Material UI, and HTM browser builds. Internet is required on the first load; the service worker then caches them for offline use.

## Limitations

- Data stays local to each browser/device; cloud sync is not included.
- Packaged-food and barcode searches require internet access. Built-in common-food presets are editable estimates and should be checked against the product label when precision matters.
- Camera barcode detection depends on browser support.
- Training suggestions are general guidance, not medical advice.


## Mixed-unit training in 6.6.4
- Every set stores its original load and unit (`kg` or `lb`).
- The global unit is only the default for new exercises and normalized charts.
- Exercise-specific unit, machine profile, and increment settings are remembered.
- Completed history is never numerically rewritten during a unit change.
- Workout CSV exports include both the original unit and a normalized kilogram value.
