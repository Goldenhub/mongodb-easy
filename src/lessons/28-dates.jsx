import loans from '../data/loans.js'

const expected = loans
  .filter((l) => l.date_returned === null)
  .sort((a, b) => a._id - b._id)

const lesson = {
  id: 28,
  title: 'Date Queries - Working with Dates',
  module: 'Module 5: Power User',
  description: 'Query documents by date fields',

  explanation: (
    <>
      <p>
        MongoDB stores dates as BSON Date objects. You can compare dates using the same
        comparison operators (<code>$gt</code>, <code>$lt</code>, etc.) you use for numbers:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.loans.find({
  date_borrowed: {
    $gte: new Date("2025-03-01")
  }
})`}
      </pre>
      <p>
        In the MongoDB shell, you use <code>new Date("...")</code> or <code>ISODate("...")</code>
        to create date values. Dates are stored in UTC and can be formatted for display
        using aggregation date operators.
      </p>
      <p>
        You can also query for null dates (like books that haven't been returned yet):
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.loans.find({ date_returned: null })`}
      </pre>
    </>
  ),

  task: 'Find all loans where date_returned is null (books that have not been returned yet).',

  defaultQuery: 'db.loans.find({ date_returned: null })',

  collections: {
    loans,
  },

  expectedResult: expected,

  hints: [
    'How do you find documents where a date field has not been set?',
    'Filter using `{ date_returned: null }` to find books that haven\'t been returned',
  ],
}

export default lesson
