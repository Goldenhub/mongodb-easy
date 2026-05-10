import products from '../data/products.js'

const expected = products
  .filter((p) => p.reviews.length > 0)
  .flatMap((p) => p.reviews.map((r) => ({
    _id: p._id,
    name: p.name,
    reviewUser: r.user,
    reviewRating: r.rating,
    reviewText: r.text,
  })))
  .sort((a, b) => a.name.localeCompare(b.name) || a.reviewUser.localeCompare(b.reviewUser))

const lesson = {
  id: 14,
  title: '$unwind - Deconstruct Arrays',
  module: 'Module 2: Aggregation',
  description: 'Flatten array fields into multiple documents',

  explanation: (
    <>
      <p>
        When a document contains an array field, <code>$unwind</code> deconstructs it -
        creating one output document for each array element:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.products.aggregate([
  { $unwind: "$reviews" }
])`}
      </pre>
      <p>
        If a product has 3 reviews, <code>$unwind</code> produces 3 documents, each with
        the product's other fields and a single review. Documents with empty arrays are
        removed (use <code>preserveNullAndEmptyArrays: true</code> to keep them).
      </p>
      <p>
        After unwinding, you can use <code>$match</code>, <code>$group</code>, or
        &nbsp;<code>$project</code> on the individual elements.
      </p>
    </>
  ),

  howItWorks: (
    <>
      <p><code>$unwind</code> duplicates the document for each array element, replacing the array field with a single element. If a product has reviews: <code>[alice, bob]</code>, you get two documents - one with <code>reviews: &#123; user: "alice", ... &#125;</code> and another with <code>reviews: &#123; user: "bob", ... &#125;</code>.</p>
      <p>The <code>$</code> prefix in <code>"$reviews"</code> tells MongoDB this is a <strong>field path</strong> (a reference to a field in the current document), not a string literal.</p>
      <p className="font-semibold text-indigo-700">Key insight: After <code>$unwind</code>, you can filter individual array elements with <code>$match</code> - something you can't do when the elements are still nested in an array.</p>
    </>
  ),

  realWorldUse: (
    <p>Unwinding is essential whenever data is stored in arrays and you need to analyze individual items. Examples: analyzing each review rating for a product, calculating average time per order line item, or flattening a tags array for faceted search.</p>
  ),

  commonMistakes: (
    <>
      <p><strong>Forgetting the <code>$</code> prefix.</strong> <code>{'{ $unwind: "reviews" }'}</code> treats "reviews" as a literal string, not a field reference. Always use <code>"$fieldName"</code>.</p>
      <p><strong>Unwinding too early.</strong> If you only need the array length or to filter based on array properties, use <code>$size</code> or <code>$elemMatch</code> instead - they're much more efficient.</p>
    </>
  ),

  dataFlow: ['products', '$unwind "$reviews"', '$project', 'Result'],

  task: 'Use $unwind on the reviews array of products, then project the product name, review user, rating, and text.',

  defaultQuery: 'db.products.aggregate([\n  { $unwind: "$reviews" },\n  { $project: { name: 1, reviewUser: "$reviews.user", reviewRating: "$reviews.rating", reviewText: "$reviews.text", _id: 1 } }\n])',

  collections: {
    products,
  },

  expectedResult: expected,

  hints: [
    'Which stage deconstructs an array field so each element becomes its own document?',
    'Use `$unwind` on the array field path like `"$reviews"`',
  ],
}

export default lesson
