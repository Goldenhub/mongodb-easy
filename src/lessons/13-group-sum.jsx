import books from '../data/books.js'

const groupMap = {}
for (const b of books) {
  if (!groupMap[b.genre]) groupMap[b.genre] = { _id: b.genre, totalCopies: 0, avgRating: 0, count: 0 }
  groupMap[b.genre].totalCopies += b.copies
  groupMap[b.genre].avgRating += b.rating
  groupMap[b.genre].count++
}
const expected = Object.values(groupMap).map((g) => ({
  _id: g._id,
  totalCopies: g.totalCopies,
  avgRating: Math.round((g.avgRating / g.count) * 100) / 100,
}))

const lesson = {
  id: 13,
  title: '$group with $sum and $avg',
  module: 'Module 2: Aggregation',
  description: 'Group documents and compute aggregate values',

  explanation: (
    <>
      <p>
        The <code>$group</code> stage groups documents by a key expression and computes
        aggregate values for each group using <strong>accumulators</strong>.
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      totalCopies: { $sum: "$copies" },
      avgRating: { $avg: "$rating" }
    }
  }
])`}
      </pre>
      <p>
        The <code>_id</code> field defines how documents are grouped - here by the
        &nbsp;<code>genre</code> field. <code>$sum</code> adds up the values, and
        &nbsp;<code>$avg</code> calculates the average.
      </p>
      <p>
        Common accumulators: <code>$sum</code>, <code>$avg</code>, <code>$min</code>,
        &nbsp;<code>$max</code>, <code>$push</code>, <code>$addToSet</code>, <code>$first</code>,
        &nbsp;<code>$last</code>.
      </p>
    </>
  ),

  task: 'Group books by genre and calculate the totalCopies (sum of copies) and avgRating for each genre.',

  defaultQuery: 'db.books.aggregate([\n  { $group: { _id: "$genre", totalCopies: { $sum: "$copies" }, avgRating: { $avg: "$rating" } } }\n])',

  collections: {
    books,
  },

  expectedResult: expected,

  hints: [
    'Which stage groups documents and computes aggregate values per group?',
    'Use `$group` with `_id: "$genre"`, then `$sum` and `$avg` accumulators',
  ],
}

export default lesson
