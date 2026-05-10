import books from '../data/books.js'

const lesson = {
  id: 16,
  title: '$count - Counting Documents',
  module: 'Module 2: Aggregation',
  description: 'Count documents at any point in the pipeline',

  explanation: (
    <>
      <p>
        The <code>$count</code> stage replaces the stream of documents with a single
        document containing the count. You give it a field name for the result:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  { $match: { genre: "fiction" } },
  { $count: "totalFictionBooks" }
])`}
      </pre>
      <p>
        This returns <code>{`{ "totalFictionBooks": 5 }`}</code> - the number of fiction
        books. You can also use <code>countDocuments()</code> directly:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.countDocuments({ genre: "fiction" })`}
      </pre>
      <p>
        The advantage of <code>$count</code> in a pipeline is that you can place it after
        other stages to count filtered, grouped, or unwound results.
      </p>
    </>
  ),

  task: 'Count how many books have a rating of 4.0 or higher. Name the count "highRatedBooks".',

  defaultQuery: 'db.books.aggregate([\n  { $match: { rating: { $gte: 4 } } },\n  { $count: "highRatedBooks" }\n])',

  collections: {
    books,
  },

  expectedResult: [{ highRatedBooks: books.filter((b) => b.rating >= 4).length }],

  hints: [
    'Which stage returns the count of documents in the pipeline?',
    'Use `$match` to filter first, then `$count` with a name string like `"total"`',
  ],
}

export default lesson
