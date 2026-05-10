import books from '../data/books.js'

const expected = books.map((b) => ({
  _id: b._id,
  title: b.title,
  rating: b.rating,
  label: b.rating >= 4.5 ? "Excellent" : b.rating >= 4 ? "Good" : "Average",
})).sort((a, b) => a.title.localeCompare(b.title))

const lesson = {
  id: 27,
  title: '$cond and $ifNull - Conditional Logic',
  module: 'Module 4: Advanced Queries',
  description: 'Add conditional logic to your aggregations',

  explanation: (
    <>
      <p>
        <code>$cond</code> provides if-then-else logic inside aggregation expressions:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $project: {
      title: 1,
      rating: 1,
      label: {
        $cond: [
          { $gte: ["$rating", 4.5] },
          "Excellent",
          { $cond: [
            { $gte: ["$rating", 4] },
            "Good",
            "Average"
          ]}
        ]
      }
    }
  }
])`}
      </pre>
      <p>
        <code>$ifNull</code> provides a default value when a field is null or missing:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.products.aggregate([
  {
    $project: {
      name: 1,
      rating: { $ifNull: ["$rating", "No rating"] }
    }
  }
])`}
      </pre>
      <p>
        This is the MongoDB equivalent of SQL's <code>CASE WHEN</code> and
        &nbsp;<code>COALESCE</code>.
      </p>
    </>
  ),

  task: 'Add a "label" field to each book: "Excellent" for rating >= 4.5, "Good" for >= 4, otherwise "Average". Show title, rating, and label.',

  defaultQuery: 'db.books.aggregate([\n  {\n    $project: {\n      title: 1,\n      rating: 1,\n      label: {\n        $cond: [\n          { $gte: ["$rating", 4.5] },\n          "Excellent",\n          {\n            $cond: [\n              { $gte: ["$rating", 4] },\n              "Good",\n              "Average"\n            ]\n          }\n        ]\n      }\n    }\n  }\n])',

  collections: {
    books,
  },

  expectedResult: expected,

  hints: [
    'Which operator provides if-then-else logic in aggregations?',
    'Use `$cond` with `$gte` for comparisons, and `$ifNull` to handle missing values',
  ],
}

export default lesson
