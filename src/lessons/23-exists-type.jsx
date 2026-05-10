import products from '../data/products.js'

const lesson = {
  id: 23,
  title: '$exists and $type - Field Existence and Type',
  module: 'Module 4: Advanced Queries',
  description: 'Check if a field exists or check its BSON type',

  explanation: (
    <>
      <p>
        MongoDB documents can have different fields - not every document needs to have
        the same structure. <code>$exists</code> checks whether a field is present:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ isbn: { $exists: false } })`}
      </pre>
      <p>
        This returns books that <em>don't</em> have an <code>isbn</code> field.
        Use <code>$exists: true</code> to find documents that <em>do</em> have the field.
      </p>
      <p>
        The <code>$type</code> operator filters by BSON data type:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.find({ rating: { $type: "number" } })`}
      </pre>
      <p>
        Common types: <code>"string"</code>, <code>"number"</code>, <code>"bool"</code>,
        &nbsp;<code>"array"</code>, <code>"object"</code>, <code>"null"</code>.
      </p>
    </>
  ),

  task: 'Find all products where the "reviews" field exists and is an array (hint: use $exists).',

  defaultQuery: 'db.products.find({ reviews: { $exists: true } })',

  collections: {
    products,
  },

  expectedResult: products.filter((p) => p.reviews !== undefined),

  hints: [
    'Which operator checks whether a field exists on a document?',
    'Use `$exists: true` on the `reviews` field to find books with reviews',
  ],
}

export default lesson
