import books from '../data/books.js'

const topRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3)

const groupMap = {}
for (const b of books) {
  if (!groupMap[b.genre]) groupMap[b.genre] = { _id: b.genre, avgPrice: 0, count: 0 }
  groupMap[b.genre].avgPrice += b.price
  groupMap[b.genre].count++
}
const avgByGenre = Object.values(groupMap).map((g) => ({
  _id: g._id,
  avgPrice: Math.round((g.avgPrice / g.count) * 1e10) / 1e10,
}))

const expected = [{
  topRated,
  avgPriceByGenre: avgByGenre,
}]

const lesson = {
  id: 33,
  title: '$facet - Multi-Faceted Aggregation',
  module: 'Module 5: Power User',
  description: 'Run multiple pipelines on the same input documents',

  explanation: (
    <>
      <p>
        The <code>$facet</code> stage lets you run multiple aggregation pipelines on the
        <em>same set of input documents</em> and get the results in a single output document:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $facet: {
      topRated: [
        { $sort: { rating: -1 } },
        { $limit: 3 }
      ],
      avgPriceByGenre: [
        { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
      ]
    }
  }
])`}
      </pre>
      <p>
        <code>$facet</code> is incredibly powerful for dashboards and data exploration.
        Each sub-pipeline is independent and receives the same input documents.
      </p>
      <p>
        The output is a single document with one field per sub-pipeline. This is the
        MongoDB equivalent of running multiple queries in parallel.
      </p>
    </>
  ),

  task: 'Use $facet to create two fields: "topRated" (top 3 books by rating) and "avgPriceByGenre" (average price for each genre).',

  defaultQuery: 'db.books.aggregate([\n  {\n    $facet: {\n      topRated: [\n        { $sort: { rating: -1 } },\n        { $limit: 3 }\n      ],\n      avgPriceByGenre: [\n        { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }\n      ]\n    }\n  }\n])',

  collections: {
    books,
  },

  expectedResult: expected,

  hints: [
    'Which stage runs multiple sub-pipelines on the same set of documents?',
    'Use `$facet` with named sub-pipelines like `topRated` and `avgPriceByGenre`',
  ],
}

export default lesson
