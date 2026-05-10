import books from '../data/books.js'

const expected = books.map((b) => ({
  _id: b._id,
  title: b.title,
  author: b.author,
  genre: b.genre,
  pages: b.pages,
  rating: b.rating,
  price: b.price,
  copies: b.copies,
  published_year: b.published_year,
  priceCategory: b.price < 15 ? 'budget' : b.price < 30 ? 'standard' : 'premium',
})).sort((a, b) => a.title.localeCompare(b.title))

const lesson = {
  id: 15,
  title: '$addFields - Add Computed Fields',
  module: 'Module 2: Aggregation',
  description: 'Add new fields while keeping all existing fields',

  explanation: (
    <>
      <p>
        Unlike <code>$project</code> which can only keep explicitly included fields,
        &nbsp;<code>$addFields</code> adds new fields while keeping <em>all</em> existing
        fields unchanged:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $addFields: {
      priceCategory: "standard",
      discountedPrice: { $multiply: ["$price", 0.9] }
    }
  }
])`}
      </pre>
      <p>
        This is useful when you want to add computed metadata without losing the original
        document structure. The new fields can use <code>$cond</code> for conditional logic:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $addFields: {
      priceCategory: {
        $cond: [
          { $lt: ["$price", 15] },
          "budget",
          { $cond: [
            { $lt: ["$price", 30] },
            "standard",
            "premium"
          ]}
        ]
      }
    }
  }
])`}
      </pre>
    </>
  ),

  task: 'Add a field called "priceCategory" that is "budget" for prices under 15, "standard" for under 30, and "premium" for 30+. Return all fields.',

  defaultQuery: 'db.books.aggregate([\n  {\n    $addFields: {\n      priceCategory: {\n        $cond: [\n          { $lt: ["$price", 15] },\n          "budget",\n          {\n            $cond: [\n              { $lt: ["$price", 30] },\n              "standard",\n              "premium"\n            ]\n          }\n        ]\n      }\n    }\n  }\n])',

  collections: {
    books,
  },

  expectedResult: expected,

  hints: [
    'Which stage adds new fields to documents without affecting existing ones?',
    'Use `$addFields` with `$cond` to assign values based on conditions',
  ],
}

export default lesson
