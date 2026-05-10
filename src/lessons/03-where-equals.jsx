import books from '../data/books.js'

const lesson = {
  id: 3,
  title: 'Equality Filter - WHERE Equals',
  module: 'Module 1: Reading Data',
  description: 'Filter documents by exact field value',

  explanation: (
    <>
      <p>
        To find only the documents where a field matches a specific value, pass a query object
        as the first argument to <code>find()</code>:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ genre: "fiction" })`}
      </pre>
      <p>
        This returns every document where <code>genre</code> equals <code>"fiction"</code>.
        The query object uses <code>{`{field: value}`}</code> syntax, which is shorthand for
        <code>{`{ field: { $eq: value } }`}</code>.
      </p>
      <p>
        You can filter on any field - strings, numbers, booleans, or even embedded documents.
      </p>
    </>
  ),

  task: 'Return all books that have the genre "fiction".',

  defaultQuery: 'db.books.find({ genre: "fiction" })',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => b.genre === 'fiction'),

  hints: [
    'How do you find documents where a field equals a specific value?',
    'Pass a filter object to `find()` with the field name and value you want to match',
  ],
}

export default lesson
