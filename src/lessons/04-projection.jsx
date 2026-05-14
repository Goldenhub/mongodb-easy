import books from '../data/books.js'

const lesson = {
  id: 4,
  title: 'Projection - Select Specific Fields',
  module: 'Module 1: Reading Data',
  description: 'Return only the fields you need',

  explanation: (
    <>
      <p>
        When you use <code>find()</code> without a second argument, MongoDB returns every field
        in each document. Often you only need a few fields. This is where <strong>projection</strong>
        comes in.
      </p>
      <p>
        Projection is the second argument to <code>find()</code>. You specify which fields to
        include (with <code>1</code>) or exclude (with <code>0</code>):
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({}, { title: 1, author: 1 })`}
      </pre>
      <p>
        The <code>_id</code> field is included by default. To exclude it, add <code>_id: 0</code>
        &nbsp;to the projection:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({}, { title: 1, author: 1, _id: 0 })`}
      </pre>
    </>
  ),

  task: 'Return only the title and author fields from all documents in the books collection. Remember to exclude _id.',

  defaultQuery: 'db.books.find({}, { title: 1, author: 1, _id: 0 })',

  collections: {
    books,
  },

  expectedResult: books.map((b) => ({ title: b.title, author: b.author })).sort((a, b) => a.title.localeCompare(b.title)),

  hints: [
    'How do you select only specific fields to return?',
    'Pass a second argument to `find()` with the field names you want, set to 1',
    'Try: `find({}, { title: 1, author: 1, _id: 0 })`',
  ],
}

export default lesson
