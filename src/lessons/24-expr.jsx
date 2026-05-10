import books from '../data/books.js'

const lesson = {
  id: 24,
  title: '$expr - Compare Fields Within a Document',
  module: 'Module 4: Advanced Queries',
  description: 'Compare two fields in the same document using $expr',

  explanation: (
    <>
      <p>
        Normally, a query compares a field to a fixed value. But what if you want to
        compare <em>two fields</em> within the same document? That's where
        <code>$expr</code> comes in:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({
  $expr: { $gt: ["$copies", "$rating"] }
})`}
      </pre>
      <p>
        The <code>$expr</code> operator lets you use aggregation expressions inside a
        query. The <code>$</code> prefix refers to field values (e.g., <code>"$copies"</code>
         &nbsp;means the value of the <code>copies</code> field).
      </p>
      <p>
        This is useful for: comparing fields, date arithmetic, and conditional logic
        within queries. You can use <code>$gt</code>, <code>$gte</code>, <code>$lt</code>,
        <code>$lte</code>, <code>$eq</code>, <code>$ne</code> inside <code>$expr</code>.
      </p>
    </>
  ),

  task: 'Find books where the number of pages is greater than the published_year (use $expr).',

  defaultQuery: 'db.books.find({ $expr: { $gt: ["$pages", "$published_year"] } })',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => b.pages > b.published_year),

  hints: [
    'Which operator lets you compare two fields within the same document?',
    'Use `$expr` with `$gt` comparing `"$pages"` and `"$published_year"`',
  ],
}

export default lesson
