import books from '../data/books.js'

const lesson = {
  id: 8,
  title: '$in and $nin - Match a List of Values',
  module: 'Module 1: Reading Data',
  description: 'Filter documents where a field matches any value in a list',

  explanation: (
    <>
      <p>
        The <code>$in</code> operator lets you match documents where a field equals any of
        several values. It's like an OR statement but shorter:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ genre: { $in: ["fiction", "technology"] } })`}
      </pre>
      <p>
        This returns books where <code>genre</code> is either <code>"fiction"</code> or
        &nbsp;<code>"technology"</code>.
      </p>
      <p>
        The <code>$nin</code> (not-in) operator does the opposite - it matches documents where
        the field is <em>not</em> any of the listed values:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ genre: { $nin: ["fiction"] } })`}
      </pre>
    </>
  ),

  task: 'Return all books published in either 2008 or 1949 using $in.',

  defaultQuery: 'db.books.find({ published_year: { $in: [2008, 1949] } })',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => b.published_year === 2008 || b.published_year === 1949),

  hints: [
    'Which operator checks if a field value is in a given list?',
    'Use `$in` with an array of values inside the field filter',
  ],
}

export default lesson
