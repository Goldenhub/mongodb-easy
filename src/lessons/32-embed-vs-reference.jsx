import products from '../data/products.js'
import books from '../data/books.js'
import authors from '../data/authors.js'

const lesson = {
  id: 32,
  title: 'Embedding vs Referencing',
  module: 'Module 5: Power User',
  description: 'When to embed related data vs reference other collections',

  explanation: (
    <>
      <p>
        MongoDB's document model gives you two ways to handle related data: <strong>embedding</strong> and <strong>referencing</strong>. Choosing the right approach is one of the most important data modeling decisions you'll make.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">Embedding</h3>
      <p>
        Embedding stores related data directly inside the document as a nested array or object. The <code>products</code> collection uses this pattern - each product has a <code>reviews</code> array right in the document:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`{
  _id: 1,
  name: "Ergonomic Keyboard",
  price: 89.99,
  reviews: [
    { user: "alice", rating: 5, text: "Best keyboard ever!" },
    { user: "bob", rating: 4, text: "Great but expensive" }
  ]
}`}
      </pre>
      <p className="font-semibold text-indigo-700">
        Use embedding when data is <em>contained by</em> and <em>accessed with</em> the parent document.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">Referencing</h3>
      <p>
        Referencing stores only an identifier (like an ID or name) that links to a document in another collection. The <code>books</code> and <code>authors</code> collections use this - books store the <code>author</code> name as a reference, and the full author details live in a separate collection:
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`// books document
{ _id: 1, title: "Moby Dick", author: "Herman Melville" }

// authors document (separate collection)
{ _id: 1, name: "Herman Melville", nationality: "American" }`}
      </pre>
      <p className="font-semibold text-indigo-700">
        Use referencing when data is shared across many documents or grows independently.
      </p>
      <p className="mt-3">
        When you query referenced data and want the related fields in your result, use <code>$lookup</code> in an aggregation pipeline. It joins the collections and adds the referenced documents as an array field (see lesson 26).
      </p>

      <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-sm text-indigo-900 font-semibold mb-1">MongoDB's guiding principle:</p>
        <p className="text-sm text-indigo-800 italic">
          "Data that is accessed together should be stored together."
        </p>
      </div>
    </>
  ),

  howItWorks: (
    <>
      <p><strong>Embedding</strong> is a denormalized approach - related data is stored together, so a single query retrieves everything. This is fast for reads but can cause data duplication if the same related data appears in multiple parent documents (e.g., an author's bio embedded in every book).</p>
      <p><strong>Referencing</strong> is normalized - related data lives in its own collection and is connected by a reference field. To read the related data you need a second query or a <code>$lookup</code> aggregation. This avoids duplication but adds complexity.</p>
      <p className="font-semibold text-indigo-700">Key insight: there's no single right answer. The best choice depends on how your application reads and writes data.</p>
    </>
  ),

  realWorldUse: (
    <ul className="list-disc list-inside space-y-1">
      <li><strong>Embed:</strong> Order line items inside an order, comments on a blog post, reviews on a product, addresses on a user profile - data that's always fetched together and only belongs to one parent.</li>
      <li><strong>Reference:</strong> Users and their orders (orders are many and grow fast), books and authors (one author has many books), products and categories (categories are shared across products).</li>
    </ul>
  ),

  commonMistakes: (
    <ul className="list-disc list-inside space-y-1">
      <li><strong>Embedding everything.</strong> Documents have a 16MB size limit. Reviews that grow unbounded over time could exceed this.</li>
      <li><strong>Referencing everything.</strong> If you always need the related data, you'll end up doing expensive <code>$lookup</code> joins on every read.</li>
      <li><strong>Ignoring access patterns.</strong> The right choice depends on how your app queries data, not on how the data is structured conceptually.</li>
    </ul>
  ),

  dataFlow: ['Design decision → Embed or Reference → Schema → Query pattern'],

  task: 'Find the "Ergonomic Keyboard" product in the products collection to see how embedding works - its reviews are stored directly inside the document.',

  defaultQuery: 'db.products.find({ name: "Ergonomic Keyboard" })',

  collections: {
    products,
    books,
    authors,
  },

  expectedResult: [products.find((p) => p.name === 'Ergonomic Keyboard')],

  hints: [
    'Use find() on the products collection',
    'Filter by the name field using an object like { name: "Ergonomic Keyboard" }',
  ],
}

export default lesson
