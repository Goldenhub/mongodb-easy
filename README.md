# MongoDB Easy

An interactive, in-browser MongoDB tutorial. Write real MongoDB queries against real data and get instant feedback — no setup, no signup, no cloud.

## Features

- **Real MongoDB queries** — Type real `find()`, `aggregate()`, `sort()`, `group()`, `lookup()` syntax. A custom query engine runs it all in your browser.
- **Immediate feedback** — See your result side-by-side with the expected output. Know instantly if you got it right.
- **32 progressive lessons** — Start with `find()` and work up to `$bucket`, `$facet`, and `$lookup`. Five modules covering reading, aggregation, writes, advanced queries, and analytical patterns.
- **Hints that guide** — Progressive hints for each lesson that point you in the right direction without giving away the answer.
- **No signup, no cost** — Everything runs client-side. No account, no email, no credit card.
- **Progress that persists** — Completed lessons, last query, and attempt counts are saved to localStorage automatically.
- **Analytics** — Optional PostHog integration tracks lesson completions, query attempts, hint usage, and drop-off to help improve the curriculum.

## Tech Stack

| Tool | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Dev server and bundler |
| **Tailwind CSS v4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Monaco Editor** | In-browser code editor |
| **PostHog** | Product analytics (optional) |
| **canvas-confetti** | Celebration animations |
| **Vitest** | Unit testing |
| **ESLint** | Linting |

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_PUBLIC_POSTHOG_KEY` | No | — | PostHog project API key for analytics |
| `VITE_PUBLIC_POSTHOG_HOST` | No | `https://us.i.posthog.com` | PostHog instance host |

Analytics is a no-op when the key is not set, so you can develop without it.

> **Note:** `VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST` (without `PUBLIC_`) are also accepted for compatibility.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run test` | Run unit tests with Vitest |

## Project Structure

```
src/
├── components/       # React components (Sidebar, MainPanel, QueryEditor, etc.)
├── data/             # Sample MongoDB collections (books, products, authors, etc.)
├── engine/           # Custom MongoDB query engine
│   ├── query-engine.js     # Database class — high-level operations
│   ├── pipeline-engine.js  # Aggregation pipeline executor
│   ├── mongosh-parser.js   # MongoDB shell syntax parser
│   ├── operators.js        # Query and expression operators
│   └── collection.js       # Collection class with CRUD operations
├── hooks/            # Custom React hooks (useProgress)
├── lib/              # Analytics helpers (PostHog)
├── lessons/          # 32 lesson files (one per concept)
├── pages/            # LandingPage and LearnPage
└── utils/            # Helpers (modules, comparison, table formatting)
```

## How It Works

1. **Read the explanation** — Each lesson introduces one concept with a clear example.
2. **Write the query** — Type the MongoDB query from scratch in the Monaco editor.
3. **Run and compare** — Press `Cmd+Enter` (or `Ctrl+Enter`) to execute. See your result next to the expected output.

The query engine parses MongoDB shell syntax, executes against in-memory collections, and compares results using deep equality. All data is pre-loaded sample datasets — no network requests needed.

## Analytics

PostHog analytics is built in but disabled by default. Set `VITE_PUBLIC_POSTHOG_KEY` in `.env` to enable.

The following events are tracked when analytics is active:

| Event | When |
|---|---|
| `$pageview` | Every page navigation |
| `cta_clicked` | Click on any "Start learning" / CTA button on the landing page |
| `lesson_started` | User opens a lesson |
| `query_run` | User executes a query (includes `matched` and `total_attempts`) |
| `lesson_completed` | User gets the correct answer |
| `module_completed` | All lessons in a module are finished |
| `all_lessons_completed` | All 32 lessons are finished |
| `query_error` | Query throws a parse or execution error |
| `query_reset` | User presses the Reset button |
| `hint_viewed` | User opens a hint or navigates between hints |

No personal data is collected. Events are associated with a random anonymous ID stored in localStorage.

## Adding Lessons

Each lesson is a standalone JSX file in `src/lessons/` that exports a lesson object. Here's the pattern:

```js
// src/lessons/33-new-concept.jsx
import books from '../data/books.js'

const lesson = {
  id: 33,                           // unique, sequential ID
  title: '$newOperator - Concept',   // short title
  module: 'Module 3: Modifying Data', // module name (used for display)
  description: 'One-line summary',

  explanation: (                     // JSX rendered as the main lesson content
    <>
      <p>Explanation of the concept with <code>code examples</code>.</p>
    </>
  ),

  // Optional — expandable detail boxes:
  howItWorks: <p>Deep dive into mechanics.</p>,
  realWorldUse: <p>Production use case.</p>,
  commonMistakes: <p>Pitfalls to avoid.</p>,
  syntaxBreakdown: {                 // Shows a labeled code breakdown
    query: 'db.books.find({...})',
    parts: [
      { label: 'find()', description: 'What this part does' },
    ],
  },
  dataFlow: ['Collection', '$stage1', '$stage2', 'Result'],

  task: 'Description of what the user should write.',

  defaultQuery: 'db.books.find()',   // pre-filled query that passes the lesson

  collections: { books },            // collection name → data mapping

  expectedResult: [{ ... }],         // array of documents the correct query returns

  hints: [                           // progressive hints, shown one at a time
    'First hint — vague pointer',
    'Second hint — more specific',
    'Third hint — nearly the answer',
  ],
}

export default lesson
```

### Registering a new lesson

1. Create the lesson file in `src/lessons/` (e.g. `32-new-concept.jsx`).
2. Import and add it to the array in `src/lessons/index.js`.
3. If the lesson starts a new module, add its starting lesson ID to `MODULE_NAMES` in `src/utils/modules.js`.
4. Run `npm run test` to verify the default query passes.

### Lesson fields reference

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique integer. Must match the order in the `lessons` array. |
| `title` | yes | Short display name. |
| `module` | yes | Module name shown in the header. |
| `description` | yes | One-line summary for meta/SEO. |
| `explanation` | yes | JSX — the main teaching content. |
| `task` | yes | What the user needs to do. |
| `defaultQuery` | yes | The query string that passes the lesson. Used by tests. |
| `collections` | yes | Object mapping collection names to their data arrays. |
| `expectedResult` | yes | Array of documents the correct query produces. |
| `hints` | no | Array of progressive hint strings. |
| `howItWorks` | no | JSX — expandable "How it works" box. |
| `realWorldUse` | no | JSX — expandable "Real-world use" box. |
| `commonMistakes` | no | JSX — expandable "Common mistakes" box. |
| `syntaxBreakdown` | no | Object with `query` string and `parts` array. |
| `dataFlow` | no | Array of stage name strings for pipeline visualization. |

## Testing

```bash
npm run test
```

The test suite auto-discovers all lessons in `src/lessons/index.js`. For each lesson it:

1. Creates a fresh in-memory database with the lesson's collections.
2. Executes the lesson's `defaultQuery`.
3. Compares the result against `expectedResult` using deep equality.

When adding a new lesson, write the `defaultQuery` and `expectedResult` first, then run `npm run test` to confirm they match before building the UI content.

### Test file

`src/lessons/lessons.test.js` — a single Vitest test file that iterates over every lesson:

```js
lessons.forEach((lesson) => {
  it(`lesson ${lesson.id}: ${lesson.title}`, () => {
    const db = new Database(lesson.collections)
    const { result } = db.execute(lesson.defaultQuery)
    const resultArray = Array.isArray(result) ? result : [result]
    const match = compareResults(resultArray, lesson.expectedResult)
    if (!match) {
      expect(resultArray).toEqual(lesson.expectedResult)
    }
  })
})
```

## License

MIT
