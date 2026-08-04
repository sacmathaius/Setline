# Setline PWA v6.4

## Changes
- Fixed long food-name overlap in History by reserving a separate calorie column and action row.
- Rebuilt the workout set grid so Load, Reps, and RIR/RPE have equal aligned columns.
- Added date selectors to Workout and Calories. You can add, edit, copy, or delete records on previous dates.
- Added **Copy previous workout** and **Copy previous meals**.
- Workout forms now autosave drafts locally and recover them after an accidental refresh.
- Edits and deletions support Undo.
- A clear selected-date banner reduces accidental logging on the wrong day.
- App updates now show an **Update** button and create a safety snapshot before activating.
- Data migration uses the permanent `setline-data-v1` key and no longer merges old keys on every launch.

## Upload to GitHub
1. Export a backup from **History → Export backup** while your current records are visible.
2. Open the `Setline` repository.
3. Delete or replace the old app files.
4. Upload **all files from this package to the repository root**. The icon files are intentionally in the root.
5. Commit the changes and wait for GitHub Pages to deploy.
6. Open Setline. When the update notice appears, tap **Update**.

Keep the same repository name and GitHub Pages URL. Browser storage is tied to that exact origin and path.
