# Setline 7 release checklist

Before replacing the live GitHub Pages files:

1. Export a JSON backup from Setline.
2. Upload the package to a temporary branch or test repository first.
3. Test at 360×800 and 402×874 CSS pixels.
4. Confirm an existing mixed-unit workout still shows its original kg/lb values.
5. Open Workout → Focus and update, complete, reopen, and remove a set.
5b. In Run Setup, reach the weekly preview step and use the arrow controls to move a day; confirm Reset order restores the auto-generated sequence, and confirm finishing setup saves the moved order to Profile → Schedule.
6. Complete a workout and confirm the streak and XP summary fits above phone safe areas.
7. Check Progress → Level, Weekly missions, Mastery, and Milestones.
8. Test Nutrition with the keyboard open and add a common food.
9. Switch Dark, Light, and System themes.
10. Refresh, close, and reopen the installed PWA; confirm saved data remains.
11. Test offline after one successful online load.
12. Only then merge the release into `main`.
