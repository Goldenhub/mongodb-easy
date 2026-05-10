<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into MongoDB Easy. The project already had `posthog-js` installed and a basic analytics wrapper in place. The integration was extended with four new events, error tracking via `captureException`, improved PostHog init options, and a full PostHog dashboard with five insights.

**Files changed:**

- `.env` — added `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` (the keys the analytics module reads)
- `src/lib/analytics.js` — added `defaults: '2026-01-30'` to `posthog.init`; added four new capture helpers (`captureCtaClicked`, `captureModuleCompleted`, `captureAllLessonsCompleted`, `captureQueryReset`) and `captureException` for error tracking
- `src/pages/LandingPage.jsx` — imported `captureCtaClicked` and wired `onClick` on all four CTA `<Link>` buttons (header, hero, how-it-works section, footer CTA)
- `src/pages/LearnPage.jsx` — imported and wired `captureModuleCompleted`, `captureAllLessonsCompleted`, `captureQueryReset`, and `captureException`; fires module/course completion milestones when a lesson is first completed; captures exceptions in the query error handler; captures `query_reset` on editor reset

## Event inventory

| Event | Description | File |
|---|---|---|
| `lesson_started` | User navigated to a lesson | `src/pages/LearnPage.jsx` |
| `query_run` | User ran a query against a lesson | `src/pages/LearnPage.jsx` |
| `lesson_completed` | User's query matched the expected result | `src/pages/LearnPage.jsx` |
| `query_error` | User's query threw a parse or runtime error | `src/pages/LearnPage.jsx` |
| `hint_viewed` | User revealed a hint for the current lesson | `src/components/MainPanel.jsx` |
| `cta_clicked` | User clicked a CTA button on the landing page | `src/pages/LandingPage.jsx` |
| `module_completed` | User completed all lessons in a module | `src/pages/LearnPage.jsx` |
| `all_lessons_completed` | User completed all 31 lessons in the course | `src/pages/LearnPage.jsx` |
| `query_reset` | User reset the query editor on a lesson | `src/pages/LearnPage.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/175838/dashboard/670964
- **Landing page to lesson completion funnel** (conversion): https://eu.posthog.com/project/175838/insights/EbG3bIHt
- **Daily lesson completions** (trend): https://eu.posthog.com/project/175838/insights/VzLjsGA6
- **Module completion breakdown** (by module name): https://eu.posthog.com/project/175838/insights/AsxO6PFi
- **Daily active learners** (DAU): https://eu.posthog.com/project/175838/insights/R8lhTvtO
- **Query error rate by lesson** (difficulty heatmap): https://eu.posthog.com/project/175838/insights/EZAfK44l

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
