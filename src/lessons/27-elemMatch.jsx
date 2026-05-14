import products from '../data/products.js'

const lesson = {
  id: 27,
  title: '$elemMatch - Matching Array Elements',
  module: 'Module 4: Advanced Queries',
  description: 'Match documents where an array contains elements meeting criteria',

  explanation: (
    <>
      <p>
        When you have an array of objects, <code>$elemMatch</code> matches documents
        where at least one array element satisfies <em>all</em> of the specified criteria:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.products.find({
  reviews: {
    $elemMatch: {
      rating: 5,
      user: "alice"
    }
  }
})`}
      </pre>
      <p>
        This returns products where there's a review by "alice" with a rating of 5.
        Both conditions must be true on the <em>same</em> array element.
      </p>
      <p>
        Without <code>$elemMatch</code>, a query like <code>{`{ "reviews.rating": 5, "reviews.user": "alice" }`}</code> would match if <em>any</em> review has
        rating 5 and <em>any</em> review has user "alice" - they could be different
        reviews.
      </p>
    </>
  ),

  task: 'Find products where there is a review with a rating of 5 by the user "alice".',

  defaultQuery: 'db.products.find({ reviews: { $elemMatch: { rating: 5, user: "alice" } } })',

  collections: {
    products,
  },

  expectedResult: products.filter((p) => p.reviews.some((r) => r.rating === 5 && r.user === 'alice')),

  hints: [
    'Which operator finds documents with array elements that match multiple criteria?',
    'Use `$elemMatch` with conditions for `rating` and `user` inside the `reviews` field',
  ],
}

export default lesson
