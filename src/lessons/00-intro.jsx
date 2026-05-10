import books from '../data/books.js'

const lesson = {
  id: 0,
  title: 'What is MongoDB?',
  module: 'Introduction',
  description: 'Understand the MongoDB document model, BSON, ObjectId, and how it differs from SQL',

  explanation: (
    <>
      <p>
        MongoDB is a <strong>NoSQL document database</strong>. Instead of tables and rows (like SQL),
        it stores data as <strong>documents</strong> in <strong>collections</strong>.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
        <h3 className="text-sm font-bold text-blue-900 mb-2">Documents & Collections</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded p-3 border border-blue-100">
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">SQL (Relational)</div>
            <div className="text-blue-900 space-y-1">
              <div>Database &rarr; Table &rarr; Row &rarr; Column</div>
              <div className="text-xs text-blue-500 mt-1">Fixed schema, joins, normalised</div>
            </div>
          </div>
          <div className="bg-white rounded p-3 border border-blue-100">
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">MongoDB (Document)</div>
            <div className="text-blue-900 space-y-1">
              <div>Database &rarr; Collection &rarr; Document &rarr; Field</div>
              <div className="text-xs text-blue-500 mt-1">Flexible schema, embedded data, no joins</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-4">
        <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
          BSON & ObjectId
        </p>
        <p className="text-sm text-amber-900">
          MongoDB stores documents in <strong>BSON</strong> format (Binary JSON), which supports more
          data types than regular JSON &mdash; like <strong>ObjectId</strong>, <strong>Date</strong>,
          <code className="text-amber-900 bg-amber-200/50 px-1 rounded">NumberLong</code>,
          and <strong>Binary</strong>.
        </p>
        <p className="text-sm text-amber-900 mt-2">
          Every document has an <code className="text-amber-900 bg-amber-200/50 px-1 rounded">_id</code> field as its
          primary key. In a real MongoDB database, <code className="text-amber-900 bg-amber-200/50 px-1 rounded">_id</code> is an
          &nbsp;<strong>ObjectId</strong> &mdash; a 12-byte hex string like
          &nbsp;<code className="text-amber-900 bg-amber-200/50 px-1 rounded">ObjectId("507f1f77bcf86cd799439011")</code>.
          This playground uses simple numbers for readability, but the concepts are the same.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 my-4">
        <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">
          Flexible Schema
        </p>
        <p className="text-sm text-green-900">
          Unlike SQL tables where every row has the same columns, MongoDB documents in the same
          collection can have different fields. This makes it easy to evolve your data model
          without migrations &mdash; just start storing the new field.
        </p>
      </div>

      <p>
        Run the query below to see what a MongoDB document looks like in this playground.
        You'll see the <code>_id</code>, <code>title</code>, <code>author</code>, and other fields
        that make up a single book document.
      </p>
    </>
  ),

  task: 'Run the query to see what a MongoDB document looks like.',

  defaultQuery: 'db.books.findOne()',

  collections: {
    books,
  },

  expectedResult: [books[0]],

  hints: [
    'Use findOne() to return a single document',
    'Try: `db.books.findOne()`',
  ],
}

export default lesson
