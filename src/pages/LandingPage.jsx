import { Link } from 'react-router-dom'
import { captureCtaClicked } from '../lib/phuglytics.js'

const features = [
  {
    title: 'Real MongoDB queries',
    desc: 'Type real MongoDB syntax - find, aggregate, sort, group, lookup. Your browser runs a custom query engine. No setup, no cloud.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Immediate feedback',
    desc: 'Run your query and see your result side-by-side with the expected output. Know instantly if you got it right - and what to fix if you did not.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: '31 progressive lessons',
    desc: 'Start with find() and work up to $bucket, $facet, and $lookup. Each lesson builds on the last - no gaps, no jumps.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
  },
  {
    title: 'Hints that guide, not give away',
    desc: 'Stuck? Progressive hints point you in the right direction without handing you the answer. Multiple hints per lesson, each one a little clearer.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: 'No signup, no cost',
    desc: 'Everything runs in your browser. No account, no email, no credit card. Just open the page and start writing queries.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75V11.25a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 11.25v1.5m-6 0a2.25 2.25 0 002.25 2.25h1.5A2.25 2.25 0 0015 12.75m-6 0H9m6 0h.75M12 3v.75M5.25 3.75h13.5M3 9.75h.75M3 14.25h.75M3 18.75h.75M20.25 3.75h.75M20.25 9.75h.75M20.25 14.25h.75M20.25 18.75h.75" />
      </svg>
    ),
  },
  {
    title: 'Progress that persists',
    desc: 'Your progress, completed lessons, and last query are saved automatically. Close the tab and come back - you will pick up right where you left off.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m0 0a6.022 6.022 0 01-2.77-.896" />
      </svg>
    ),
  },
]

const modules = [
  { name: 'Reading Data', range: '1-8', desc: 'find(), projections, filters, comparison and logical operators, sorting, pagination.' },
  { name: 'Aggregation Pipeline', range: '9-16', desc: '$match, $project, $group, $sort, $limit, $unwind, $addFields, $count.' },
  { name: 'Writing Data', range: '17-21', desc: 'insert, update, delete, array update operators ($push, $pop, $pull).' },
  { name: 'Advanced Queries', range: '22-28', desc: '$regex, $exists, $expr, $elemMatch, $lookup, $cond, $ifNull, dates.' },
  { name: 'Power User', range: '29-31', desc: '$slice, $bucket, $facet - real-world analytical patterns.' },
]

const steps = [
  {
    num: '01',
    title: 'Read the explanation',
    desc: 'Each lesson introduces one MongoDB concept with a clear example. The syntax is shown, the rules are explained, and you see the expected output.',
  },
  {
    num: '02',
    title: 'Write the query',
    desc: 'Type the MongoDB query from scratch in the editor. No copy-paste, no fill-in-the-blank - you write the whole thing yourself.',
  },
  {
    num: '03',
    title: 'Run and compare',
    desc: 'Press Cmd+Enter and see your result alongside the expected output. If they match, you pass. If not, tweak and try again.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#47A248">
              <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.745-.045-.21-.112-.417-.197-.61-.06-.153-.132-.324-.15-.518v-.019c-.023-.246-.09-.575-.09-.575l-.076-.305s-.33.157-.374.32c-.065.237-.064.476-.008.714.07.333.187.655.34.961.055.112.112.223.17.334-1.038 1.028-2.072 2.21-2.886 3.428-1.59 2.38-2.63 5.256-2.63 7.92 0 4.572 3.2 7.452 6.12 8.437.524.178.874.3.874.3l.05-.026c.677.315 1.443.54 2.243.66l.146.016c.374.033.748.05 1.122.05.374 0 .748-.017 1.122-.05l.146-.016c.8-.12 1.566-.345 2.242-.66l.05.025s.35-.12.875-.3c2.92-.985 6.12-3.865 6.12-8.437 0-2.664-1.082-5.498-2.67-7.878-.814-1.217-1.848-2.4-2.886-3.428z"/>
            </svg>
            MongoDB Easy
          </Link>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-xs text-slate-500 hover:text-slate-800 hidden sm:inline">Features</a>
            <a href="#curriculum" className="text-xs text-slate-500 hover:text-slate-800 hidden sm:inline">Curriculum</a>
            <a
              href="https://github.com/Goldenhub/mongodb-easy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-yellow-500 transition-colors"
              title="Star on GitHub"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              Star
            </a>
            <Link to="/learn" onClick={() => captureCtaClicked('Start learning', 'header')} className="text-xs font-medium text-white bg-[#47A248] hover:bg-[#3a8a3e] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">
              Start learning
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700 mb-6">
            Free &bull; No signup &bull; In-browser
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Learn MongoDB in{' '}
            <span className="text-[#47A248]">your browser</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A real MongoDB query engine in your browser. 31 progressive lessons.
            Type real MongoDB syntax, see results instantly, and build skills that
            translate directly to production databases.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
            <Link
              to="/learn"
              onClick={() => captureCtaClicked('Start the first lesson', 'hero')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#47A248] text-white font-medium rounded-lg hover:bg-[#3a8a3e] transition-colors text-sm whitespace-nowrap"
            >
              Start the first lesson
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
            <a
              href="#curriculum"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-medium rounded-lg border border-slate-300 hover:border-slate-400 hover:text-slate-800 transition-colors text-sm whitespace-nowrap"
            >
              See the curriculum
            </a>
          </div>
        </div>

        <div className="mt-14 max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/50 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-slate-400 font-mono">mongosh - books collection</span>
            </div>
            <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-green-400 select-none shrink-0">$</span>
                <div>
                  <div><span className="text-slate-300">db.books.find</span><span className="text-slate-500">(</span><span className="text-slate-300">{"{ rating: { $gt: 4.5 } }"}</span><span className="text-slate-500">)</span></div>
                  <div className="mt-2 text-slate-400">// returns books with rating &gt; 4.5</div>
                  <div className="mt-1.5 text-slate-500">[</div>
                  <div className="text-slate-300 pl-3">{`{ _id: 5, title: "1984", rating: 4.6 }`}</div>
                  <div className="text-slate-300 pl-3">{`{ _id: 6, title: "The Pragmatic Programmer", rating: 4.7 }`}</div>
                  <div className="text-slate-300 pl-3">{`{ _id: 8, title: "Designing Data-Intensive Apps", rating: 4.8 }`}</div>
                  <div className="text-slate-500">]</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">31</div>
            <div className="text-xs text-slate-400 mt-0.5">lessons</div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">6</div>
            <div className="text-xs text-slate-400 mt-0.5">modules</div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">$0</div>
            <div className="text-xs text-slate-400 mt-0.5">forever</div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">0</div>
            <div className="text-xs text-slate-400 mt-0.5">signup needed</div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-3">Everything you need to learn MongoDB</h2>
          <p className="text-sm text-slate-500 text-center max-w-xl mx-auto mb-10">
            No videos. No slides. Just you, the editor, and real MongoDB queries against real data.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">How it works</h2>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-start gap-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#47A248]/10 text-[#47A248] font-bold text-sm shrink-0">
                  {s.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
                    {i < steps.length - 1 && <div className="hidden sm:block flex-1 h-px bg-slate-200 ml-2" />}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/learn"
              onClick={() => captureCtaClicked('Start learning now', 'how_it_works')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#47A248] text-white font-medium rounded-lg hover:bg-[#3a8a3e] transition-colors text-sm whitespace-nowrap"
            >
              Start learning now
            </Link>
          </div>
        </div>
      </section>

      <section id="curriculum" className="border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-3">31 lessons in 5 modules</h2>
          <p className="text-sm text-slate-500 text-center max-w-lg mx-auto mb-10">
            Start at lesson 1 and progress through, or jump to a topic you need.
          </p>
          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.name} className="bg-white border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-slate-900">{m.name}</h3>
                  <span className="text-xs font-mono text-slate-400">Lessons {m.range}</span>
                </div>
                <p className="text-xs text-slate-500">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#47A248] hover:text-[#3a8a3e] transition-colors"
            >
              See all lessons
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Ready to start writing MongoDB queries?</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">
            No setup. No signup. Just open the editor and start typing.
          </p>
          <Link
            to="/learn"
            onClick={() => captureCtaClicked('Start the first lesson', 'footer_cta')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#47A248] text-white font-medium rounded-lg hover:bg-[#3a8a3e] transition-colors text-sm whitespace-nowrap"
          >
            Start the first lesson
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 py-3 sm:h-14">
          <span className="text-xs text-slate-400">MongoDB Easy — a free, in-browser MongoDB tutorial</span>
            <span className="text-xs text-slate-40 text-center">
            Created by <a href="https://github.com/goldenhub" target="_blank" rel="noopener noreferrer" className="text-[#47A248] underline hover:brightness-75">goldenhub</a>
            {' '}&bull;{' '}
            <a href="https://linkedin.com/in/goldenazubuike" target="_blank" rel="noopener noreferrer" className="text-[#47A248] underline hover:brightness-75">LinkedIn</a>
            {' '}&bull;{' '}Not affiliated with MongoDB Inc.
          </span>
        </div>
      </footer>
    </div>
  )
}
