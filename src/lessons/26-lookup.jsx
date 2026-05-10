import books from '../data/books.js'
import authors from '../data/authors.js'

const expected = books.map((b) => {
  const authorInfo = authors.find((a) => a.name === b.author)
  return {
    _id: b._id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    pages: b.pages,
    rating: b.rating,
    price: b.price,
    copies: b.copies,
    published_year: b.published_year,
    author_details: authorInfo ? [authorInfo] : [],
  }
}).sort((a, b) => a.title.localeCompare(b.title))

const lesson = {
  id: 26,
  title: '$lookup - Join Collections',
  module: 'Module 4: Advanced Queries',
  description: 'Combine data from two collections with $lookup',

  explanation: (
    <>
      <p>
        The <code>$lookup</code> stage performs a left outer join with another collection.
        It's the MongoDB equivalent of SQL's JOIN:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author",
      foreignField: "name",
      as: "author_details"
    }
  }
])`}
      </pre>
      <p>
        This adds an <code>author_details</code> array to each book document containing
        the matching author documents from the <code>authors</code> collection.
      </p>
      <ul className="space-y-1 my-2">
        <li><code>from</code> - the collection to join with</li>
        <li><code>localField</code> - the field from the input documents</li>
        <li><code>foreignField</code> - the field from the "from" collection</li>
        <li><code>as</code> - the output array field name</li>
      </ul>
      <p>
        The result is always an array (even if there's only one match). After
        &nbsp;<code>$lookup</code>, you can use <code>$unwind</code> to flatten the array.
      </p>
    </>
  ),

  howItWorks: (
    <>
      <p>For each document in the input collection, MongoDB looks up the <code>localField</code> value, searches the <code>from</code> collection for documents where <code>foreignField</code> matches, and adds them as an array to the output.</p>
      <p>Think of it like a nested loop: for each book, find all authors where <code>book.author === author.name</code>. The matched authors are placed into the <code>author_details</code> field.</p>
      <p className="font-semibold text-indigo-700">Key insight: <code>$lookup</code> always produces an array. If there's no match, the array is empty. If there are multiple matches, the array has multiple entries. This is different from SQL's JOIN which duplicates the parent row.</p>
    </>
  ),

  realWorldUse: (
    <p><code>$lookup</code> is how you connect related data in MongoDB's document model. Common examples: attaching user profiles to orders, joining product details to order items, or fetching comments for blog posts. It's especially powerful when you need to denormalize data for reporting without actually storing duplicate data.</p>
  ),

  commonMistakes: (
    <>
      <p><strong>Mismatched field types.</strong> If <code>localField</code> is a string and <code>foreignField</code> is an ObjectId, the lookup will silently produce empty arrays. MongoDB does exact type matching.</p>
      <p><strong>Forgetting the output is an array.</strong> After <code>$lookup</code>, <code>author_details</code> is an array. Accessing <code>author_details.name</code> won't work directly - you need to <code>$unwind</code> first or use <code>$arrayElemAt</code>.</p>
    </>
  ),

  dataFlow: ['books', '$lookup (join with authors)', 'Remaining stages', 'Result'],

  task: 'Join books with the authors collection to add author_details to each book. Match on book.author = authors.name.',

  defaultQuery: 'db.books.aggregate([\n  {\n    $lookup: {\n      from: "authors",\n      localField: "author",\n      foreignField: "name",\n      as: "author_details"\n    }\n  }\n])',

  collections: {
    books,
    authors,
  },

  expectedResult: expected,

  hints: [
    'Which stage joins data from another collection in an aggregation?',
    'Use `$lookup` with `from`, `localField`, `foreignField`, and `as` options',
  ],
}

export default lesson
