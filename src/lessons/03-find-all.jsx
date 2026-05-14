import books from '../data/books.js'

const lesson = {
  id: 3,
  title: 'find() - All Documents',
  module: 'Module 1: Reading Data',
  description: 'Retrieve all documents from a collection',

  explanation: (
    <>
      <p>
        In MongoDB, data is stored in <strong>collections</strong>, which are analogous to tables
        in SQL. Each record in a collection is called a <strong>document</strong>, which is
        analogous to a row in a table.
      </p>
      <p>
        To retrieve all documents from a collection, we use the <code>find()</code> method
        with no arguments:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find()`}
      </pre>
      <p>
        This returns every document in the <code>books</code> collection. The <code>db</code> refers
        to the current database, <code>books</code> is the collection name, and <code>find()</code>
        is the method that retrieves documents.
      </p>
      <p>
        The result will show all fields (<code>_id</code>, <code>title</code>, <code>author</code>,
        <code>genre</code>, <code>pages</code>, <code>rating</code>, <code>price</code>,
        <code>copies</code>, <code>published_year</code>) for every book in the collection.
      </p>
    </>
  ),

  howItWorks: (
    <>
      <p><code>find()</code> is a <strong>query method</strong> - it asks the database for data without modifying anything. When called with no arguments, it's equivalent to saying "give me everything." MongoDB scans the collection's documents and returns them as a <strong>cursor</strong> (a pointer to results). The shell automatically displays all results.</p>
      <p>The <code>db</code> object represents your database connection. Think of it as the front door to all your data. Every operation starts with <code>db</code>.</p>
    </>
  ),

  realWorldUse: (
    <p>You'd rarely call <code>find()</code> with no filter in production - that would return millions of records and slow down your app. But it's the perfect starting point for learning, and developers use it constantly during development to inspect what's in a collection.</p>
  ),

  syntaxBreakdown: {
    query: 'db.books.find()',
    parts: [
      { label: 'db', description: 'The database object - your entry point to all MongoDB operations' },
      { label: 'books', description: 'The collection name - like a table name in SQL' },
      { label: 'find()', description: 'The method that retrieves documents. Empty () means "no filter, return everything"' },
    ],
  },

  task: 'Return all documents from the books collection using find().',

  defaultQuery: 'db.books.find()',

  collections: {
    books,
  },

  expectedResult: books,

  hints: [
    'Which method returns all documents from a collection without any filter?',
    'Try calling `find()` on the books collection with no arguments',
  ],
}

export default lesson
