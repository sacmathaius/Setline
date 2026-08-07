# Setline 7.0.0

Setline 7 is the largest interface and progression update so far. It keeps the permanent `setline-data-v1` storage key and migrates existing records without rewriting completed load values or units.

## Publish the update

1. Export a backup from **Profile → Data and reliability**.
2. Unzip this package.
3. Upload every file inside the folder to the root of the GitHub `Setline` repository.
4. Replace matching files and commit to `main`.
5. Wait for GitHub Pages to deploy, refresh the website once, and reopen the installed app.

Do not upload the ZIP itself or place the files inside an extra folder.

## Setline 7 highlights

- Custom minimal interface with compact type, thin separators, smaller controls and restrained color
- Workout Focus Mode with previous performance, load, reps, RIR, completion and set removal
- Setline XP, levels and ranks based on consistency and completed work—not raw strength
- Weekly missions for sessions, working sets, protein consistency and muscle-region coverage
- Exercise mastery tiers: Beginner, Consistent, Skilled and Mastered
- Personal milestone map and guilt-free Comeback Mode
- Existing workouts, nutrition, mixed kg/lb history, profile, recovery and schedule remain intact

## Point-system rules

XP rewards completed sessions, quality working sets, personal records, planned recovery and consistency milestones. It does not reward training to failure, extreme volume, or lifting more than other users. Useful tracking features are never locked behind XP.

## Data safety

- Permanent storage key: `setline-data-v1`
- Automatic pre-migration and last-good backups
- Empty-state overwrite guard
- Backup imports merge records instead of replacing them
- Completed mixed-unit history remains unchanged

## First load and offline use

The app uses pinned React, Material UI and HTM browser builds internally. The visible interface is a custom Setline design rather than the default Material look. Internet is required once to cache dependencies; normal tracking then works offline.

## Limitations

- Data remains local to each browser/device; cloud sync is not included.
- Packaged-food and barcode searches need internet access.
- Coaching and recovery suggestions are general guidance, not medical advice.
