import books from '../data/books.js'

const lesson = {
  id: 7,
  title: 'Logical Operators - $and and $or',
  module: 'Module 1: Reading Data',
  description: 'Combine multiple conditions with $and and $or',

  explanation: (
    <>
      <p>
        MongoDB provides <code>$and</code> and <code>$or</code> to combine multiple conditions:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({
  $and: [
    { genre: "technology" },
    { rating: { $gte: 4 } }
  ]
})`}
      </pre>
      <p>
        This returns only technology books with a rating of 4 or higher - both conditions
        must be true.
      </p>
      <p>
        Using <code>$or</code> returns documents that match <em>any</em> of the conditions:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({
  $or: [
    { genre: "fiction" },
    { pages: { $lt: 200 } }
  ]
})`}
      </pre>
      <p>
        You can even nest these operators. Note that when you specify multiple fields in a
        query object, MongoDB treats them as an implicit <code>$and</code>.
      </p>
    </>
  ),

  task: 'Return all books that are either fiction OR have a rating of 4.5 or higher.',

  defaultQuery: 'db.books.find({ $or: [ { genre: "fiction" }, { rating: { $gte: 4.5 } } ] })',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => b.genre === 'fiction' || b.rating >= 4.5),

  hints: [
    'Which logical operator matches documents that satisfy at least one condition?',
    'Use `$or` with an array of condition objects',
  ],
}

export default lesson
