# Setline PWA v6.5

## What changed
- Added a local user profile for name, goal, experience, split, and training frequency.
- Reduced Home-screen clutter by moving goals, bodyweight settings, backups, and advanced region targets into Profile.
- Added a Weekly Muscle Region Report using primary and secondary exercise mappings.
- Added next-session focus suggestions for under-covered regions.
- Added a five-tab navigation: Home, Workout, Nutrition, Progress, Profile.
- Preserved the permanent `setline-data-v1` storage key and automatic migration from previous packages.

## Update your GitHub Pages app
1. Export a backup from your current Setline installation.
2. Replace every file in the repository root with the contents of this folder.
3. Commit the changes and wait for GitHub Pages to deploy.
4. Reopen Setline. Use the in-app Update button if the old version remains cached.

## Important
- Muscle-region coverage is a practical training estimate, not a medical or physiological diagnosis.
- Working sets count 1.0 for primary regions and 0.5 for secondary regions; drop sets count 0.5. Warm-up sets do not count.
- Existing workouts without stored region tags are mapped from their exercise names when the report is generated.
- Data remains local to the browser/device unless exported and imported manually.
