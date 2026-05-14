import books from '../data/books.js'

const lesson = {
  id: 6,
  title: 'Comparison Operators - $gt, $gte, $lt, $lte',
  module: 'Module 1: Reading Data',
  description: 'Filter documents using comparison operators',

  explanation: (
    <>
      <p>
        MongoDB supports comparison operators for numeric and date fields:
      </p>
      <ul className="space-y-1 my-2">
        <li><code>{'{$gt: value}'}</code> - greater than</li>
        <li><code>{'{$gte: value}'}</code> - greater than or equal</li>
        <li><code>{'{$lt: value}'}</code> - less than</li>
        <li><code>{'{$lte: value}'}</code> - less than or equal</li>
        <li><code>{'{$ne: value}'}</code> - not equal</li>
      </ul>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ rating: { $gte: 4.5 } })`}
      </pre>
      <p>
        This returns all books where <code>rating</code> is 4.5 or higher.
      </p>
    </>
  ),

  howItWorks: (
    <>
      <p>Comparison operators go <strong>inside</strong> a field filter object. The structure is always <code>{'{ field: { $operator: value } }'}</code>. MongoDB takes the field value from each document and compares it against your value using the operator.</p>
      <p>Think of it as: "for each document, check if <code>document.field operator value</code> is true." Only documents where the comparison passes are included in the result.</p>
    </>
  ),

  commonMistakes: (
    <>
      <p><strong>Wrong order:</strong> <code>{'{ $gt: { rating: 4.3 } }'}</code> - the operator goes inside the field, not the other way around.</p>
      <p><strong>Wrong operator placement:</strong> <code>{'db.books.find({ $gt: { rating: 4.3 } })'}</code> - <code>$gt</code> is not a top-level operator in find queries; it's always nested under a field name.</p>
    </>
  ),

  syntaxBreakdown: {
    query: 'db.books.find({ rating: { $gt: 4.3 } })',
    parts: [
      { label: '{ rating: ... }', description: 'Filter by the rating field - only documents with this field are checked' },
      { label: '{ $gt: 4.3 }', description: 'The comparison: select documents where rating is greater than 4.3' },
      { label: '4.3', description: 'The threshold value - can be any number, date, or string depending on the field' },
    ],
  },

  task: 'Return all books with a rating greater than 4.3.',

  defaultQuery: 'db.books.find({ rating: { $gt: 4.3 } })',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => b.rating > 4.3),

  hints: [
    'Which comparison operator selects values greater than a threshold?',
    'Use `$gt` inside a field filter like `{ rating: { $gt: ... } }`',
  ],
}

export default lesson
