import books from '../data/books.js'

const lesson = {
  id: 12,
  title: '$project - Reshape Documents',
  module: 'Module 2: Aggregation',
  description: 'Include, exclude, or compute new fields with $project',

  explanation: (
    <>
      <p>
        Like projection in <code>find()</code>, <code>$project</code> lets you choose which
        fields to include or exclude. But <code>$project</code> can also
        <strong>create new computed fields</strong> using aggregation expressions:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $project: {
      title: 1,
      author: 1,
      priceWithTax: { $multiply: ["$price", 1.1] }
    }
  }
])`}
      </pre>
      <p>
        In the example above, <code>$price</code> refers to the value of the
        &nbsp;<code>price</code> field in the current document. The <code>$multiply</code> expression
        calculates a new field from it.
      </p>
      <p>
        You can use expressions like <code>$add</code>, <code>$subtract</code>,
        <code>$multiply</code>, <code>$divide</code>, <code>$toUpper</code>, and
        <code>$toLower</code> in projections.
      </p>
    </>
  ),

  task: 'Project only the title and a new field called "discounted" that is the price minus 5 dollars.',

  defaultQuery: 'db.books.aggregate([\n  { $project: { title: 1, discounted: { $subtract: ["$price", 5] } } }\n])',

  collections: {
    books,
  },

  expectedResult: books.map((b) => ({ _id: b._id, title: b.title, discounted: Math.round((b.price - 5) * 100) / 100 })),

  hints: [
    'Which stage lets you reshape documents by including or computing new fields?',
    'Use `$project` with `$subtract` to calculate the discounted price',
  ],
}

export default lesson
