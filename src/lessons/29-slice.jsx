import products from '../data/products.js'

const expected = products.map((p) => ({
  _id: p._id,
  name: p.name,
  category: p.category,
  price: p.price,
  stock: p.stock,
  tags: p.tags,
  reviews: p.reviews.slice(0, 1),
})).sort((a, b) => a.name.localeCompare(b.name))

const lesson = {
  id: 29,
  title: '$slice - Array Subset in Projection',
  module: 'Module 5: Power User',
  description: 'Return only a subset of array elements in projection',

  explanation: (
    <>
      <p>
        When an array field has many elements, you may only want the first few.
        The <code>$slice</code> operator in a projection limits the array size:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.products.find({}, {
  name: 1,
  category: 1,
  price: 1,
  reviews: { $slice: 1 }
})`}
      </pre>
      <p>
        This returns all products, but each product's <code>reviews</code> array is
        truncated to only the first element.
      </p>
      <p>
        You can also use a negative number to get elements from the end:
        <code>{`{ $slice: -2 }`}</code> returns the last 2 elements, and
        <code>{`{ $slice: [1, 2] }`}</code> skips 1 element then returns 2.
      </p>
    </>
  ),

  task: 'Return all products showing the name, category, price, stock, tags, and only the first review from the reviews array. Use $slice in a projection.',

  defaultQuery: 'db.products.find({}, { name: 1, category: 1, price: 1, stock: 1, tags: 1, reviews: { $slice: 1 } })',

  collections: {
    products,
  },

  expectedResult: expected,

  hints: [
    'Which operator limits the number of array elements returned in a projection?',
    'Use `$slice` in the projection to get only the first element of the array',
  ],
}

export default lesson
