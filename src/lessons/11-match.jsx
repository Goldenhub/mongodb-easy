import books from '../data/books.js'

const lesson = {
  id: 11,
  title: '$match - Filter Documents in a Pipeline',
  module: 'Module 2: Aggregation',
  description: 'Filter documents early in an aggregation pipeline',

  explanation: (
    <>
      <p>
        The aggregation pipeline is a sequence of stages that process documents step by step.
        The first and most common stage is <code>$match</code>, which filters documents -
        just like the query in <code>find()</code>.
      </p>
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm overflow-x-auto my-3">
{`db.books.aggregate([
  { $match: { genre: "fiction" } }
])`}
      </pre>
      <p>
        This behaves exactly like <code>db.books.find(&#123; genre: "fiction" &#125;)</code>.
        The difference is that <code>$match</code> can be followed by other pipeline stages
        for powerful data transformations.
      </p>
      <p>
        <strong>Tip:</strong> Put <code>$match</code> as early as possible in your pipeline
        - it reduces the number of documents that later stages need to process.
      </p>
    </>
  ),

  howItWorks: (
    <>
      <p>An aggregation pipeline is an <strong>array of stages</strong> <code>[stage1, stage2, ...]</code>. Documents enter the first stage, get processed, and the results flow to the next stage - like an assembly line.</p>
      <p><code>$match</code> uses the same query syntax as <code>find()</code>: equality <code>{'{ field: "value" }'}</code>, comparison operators <code>{'{ field: { $gt: 5 } }'}</code>, logical operators <code>{'{ $or: [...] }'}</code> - everything works the same way.</p>
      <p className="font-semibold text-indigo-700">Key insight: <code>$match</code> early = faster pipelines. Filtering first means later stages process fewer documents.</p>
    </>
  ),

  realWorldUse: (
    <p>In a real application, you almost never aggregate all documents. You filter by date range, user ID, or status first. For example, "get total sales for last month" starts with <code>{'$match: { date: { $gte: ISODate(...) } }'}</code> to narrow down before grouping.</p>
  ),

  commonMistakes: (
    <>
      <p><strong>Putting $match after $group.</strong> Unless you're filtering on the grouped results (which requires <code>$match</code> after <code>$group</code>), always filter first. Filtering after grouping means you're processing more data than necessary.</p>
      <p><strong>Using find() syntax outside $match.</strong> Remember, inside the pipeline, only aggregation operators like <code>$match</code>, <code>$group</code>, <code>$sort</code> are valid - not <code>find()</code>, <code>sort()</code>, etc.</p>
    </>
  ),

  dataFlow: ['Collection', '$match (filter)', 'Remaining stages', 'Result'],

  task: 'Use $match to return only technology books.',

  defaultQuery: 'db.books.aggregate([\n  { $match: { genre: "technology" } }\n])',

  collections: {
    books,
  },

  expectedResult: books.filter((b) => b.genre === 'technology'),

  hints: [
    'Which aggregation stage filters documents, like `find()` does?',
    'Use `$match` as the first stage in your pipeline with the filter condition',
  ],
}

export default lesson
