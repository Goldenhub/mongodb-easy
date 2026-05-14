import books from '../data/books.js'

const lesson = {
  id: 24,
  title: '$regex - Pattern Matching',
  module: 'Module 4: Advanced Queries',
  description: 'Search for patterns in string fields using regular expressions',

  explanation: (
    <>
      <p>
        The <code>$regex</code> operator lets you search for patterns in string fields
        using regular expressions:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ title: { $regex: /mongodb/i } })`}
      </pre>
      <p>
        The <code>i</code> flag makes the search case-insensitive. You can also pass the
        regex as a string:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ author: { $regex: "Martin", $options: "i" } })`}
      </pre>
      <p>
        Common regex patterns:
      </p>
      <ul className="space-y-1 my-2">
        <li><code>/^pattern/</code> - starts with</li>
        <li><code>/pattern$/</code> - ends with</li>
        <li><code>/pattern/i</code> - case-insensitive</li>
        <li><code>/.*pattern.*/</code> - contains (equivalent to LIKE '%pattern%')</li>
      </ul>
    </>
  ),

  task: 'Find all books where the author\'s name contains "Martin" (case-insensitive).',

  defaultQuery: 'db.books.find({ author: { $regex: /martin/i } })',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => /martin/i.test(b.author)),

  hints: [
    'Which operator matches string patterns in a field?',
    'Use `$regex` with a case-insensitive pattern like `/martin/i`',
  ],
}

export default lesson
