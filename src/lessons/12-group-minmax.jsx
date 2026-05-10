import books from '../data/books.js'

const groupMap = {}
for (const b of books) {
  if (!groupMap[b.genre]) groupMap[b.genre] = { _id: b.genre, minPages: Infinity, maxPages: -Infinity, titles: [] }
  if (b.pages < groupMap[b.genre].minPages) groupMap[b.genre].minPages = b.pages
  if (b.pages > groupMap[b.genre].maxPages) groupMap[b.genre].maxPages = b.pages
  groupMap[b.genre].titles.push(b.title)
}
const expected = Object.values(groupMap).map((g) => ({
  _id: g._id,
  minPages: g.minPages,
  maxPages: g.maxPages,
  titles: g.titles,
})).sort((a, b) => String(a._id).localeCompare(String(b._id)))

const lesson = {
  id: 12,
  title: '$group with $min, $max, and $push',
  module: 'Module 2: Aggregation',
  description: 'Find extremes and collect values within each group',

  explanation: (
    <>
      <p>
        Beyond sums and averages, <code>$group</code> can find minimum and maximum values
        with <code>$min</code> and <code>$max</code>, and collect values into arrays
        with <code>$push</code>:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      minPages: { $min: "$pages" },
      maxPages: { $max: "$pages" },
      titles: { $push: "$title" }
    }
  }
])`}
      </pre>
      <p>
        <code>$min</code> and <code>$max</code> work on numbers and dates.
        <code>$push</code> collects every value into an array - use <code>$addToSet</code>
        instead if you want only unique values.
      </p>
    </>
  ),

  task: 'Group books by genre and show the minPages, maxPages, and a list of titles for each genre.',

  defaultQuery: 'db.books.aggregate([\n  { $group: { _id: "$genre", minPages: { $min: "$pages" }, maxPages: { $max: "$pages" }, titles: { $push: "$title" } } }\n])',

  collections: {
    books,
  },

  expectedResult: expected,

  hints: [
    'Which accumulators find the minimum, maximum, and collect values in `$group`?',
    'Try `$min`, `$max`, and `$push` inside a `$group` stage',
  ],
}

export default lesson
