# Setline 7.0.3 QA report

## Demo data used

- Mixed kg/lb workouts
- First-time exercise baselines and later genuine PR improvements
- Explicit zero-set and zero-rep records
- Planned training and rest days
- Rest-only schedule with nutrition data but no workout
- Three completed workout days with 12 working sets
- Four protein-target days
- Current-week mission completion

## Results

18 focused reliability checks passed:

- Permanent `setline-data-v1` key preserved
- Explicit zero sets remain zero
- Zero-rep rows do not affect coverage, XP, missions, or mastery
- Bodyweight sets with reps remain valid at zero external load
- Rest-only plans cannot create a streak
- Rest days can maintain a streak anchored by completed training
- First performance establishes a PR baseline without PR XP
- A later improvement creates exactly one PR event
- Exercise-name capitalization does not split PR history
- Weekly mission rewards are included in XP once per week
- Changelog correctly marks 7.0.3 current
- Food lookup requests only required fields
- Online results are capped and kept in component memory only
- Previous requests are aborted
- Requests time out after eight seconds
- Exact error diagnostics can be copied
- Manifest and JavaScript syntax are valid
- Service-worker cache names were advanced to 7.0.3

## Limitation

The build environment could not complete a live remote Open Food Facts request, so the successful online-response path was not end-to-end tested here. Offline, timeout, cancellation, request-size safeguards, and fallback paths were validated.
