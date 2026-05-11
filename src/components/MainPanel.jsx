import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import QueryEditor from './QueryEditor.jsx'
import ResultsPane from './ResultsPane.jsx'
import SchemaViewer from './SchemaViewer.jsx'
import { HowItWorks, RealWorldUse, CommonMistakes, SyntaxBreakdown, DataFlow } from './ConceptBox.jsx'
import { getModuleForLesson, getShortModuleName } from '../utils/modules.js'
import { captureHintViewed } from '../lib/phuglytics.js'

export default function MainPanel({
  lesson,
  query,
  onQueryChange,
  onRun,
  onReset,
  isRunning,
  yourResult,
  match,
  error,
  modKey,
  onNextLesson,
  lessonStates,
  countCompleted,
  totalLessons,
  isSandbox,
}) {
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showMobileCollections, setShowMobileCollections] = useState(false)
  const prevMatch = useRef(null)

  const hints = lesson?.hints ?? (lesson?.hint ? [lesson.hint] : null)
  const hintCount = hints?.length ?? 0

  useEffect(() => {
    if (showHint) {
      captureHintViewed(lesson.id, hintIndex, hintCount)
    }
  }, [showHint, hintIndex, lesson.id, hintCount])

  useEffect(() => {
    if (match === true && prevMatch.current !== true) {
      const defaults = {
        spread: 90,
        ticks: 80,
        colors: ['#47A248', '#22c55e', '#16a34a', '#4ade80', '#86efac', '#fbbf24', '#f59e0b'],
        origin: { y: 0.5 },
      }
      confetti({ ...defaults, angle: 60, particleCount: 40 })
      confetti({ ...defaults, angle: 120, particleCount: 40 })
      setTimeout(() => {
        confetti({ ...defaults, angle: 70, particleCount: 25, spread: 60, startVelocity: 35 })
        confetti({ ...defaults, angle: 110, particleCount: 25, spread: 60, startVelocity: 35 })
      }, 200)
    }
    prevMatch.current = match
  }, [match])

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <p>Select a lesson to begin</p>
      </div>
    )
  }

  const moduleForLesson = getModuleForLesson(lesson.id, totalLessons)
  const isLastInModule = moduleForLesson && lesson.id === moduleForLesson.end
  const allModuleLessonsDone = moduleForLesson && lessonStates
    ? (() => {
        for (let id = moduleForLesson.start; id <= moduleForLesson.end; id++) {
          if (!lessonStates[String(id)]?.completed) return false
        }
        return true
      })()
    : false
  const allLessonsDone = countCompleted === totalLessons

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      {isSandbox ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed">
              {lesson.explanation}
            </div>

            <button
              onClick={() => setShowMobileCollections(!showMobileCollections)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Collections
              <svg className={`w-3.5 h-3.5 transition-transform ${showMobileCollections ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {showMobileCollections && (
              <div className="lg:hidden border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <SchemaViewer collections={lesson.collections} />
              </div>
            )}

            <QueryEditor
              value={query}
              onChange={onQueryChange}
              onRun={onRun}
              onReset={onReset}
              isRunning={isRunning}
              modKey={modKey}
            />

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" />
                  <path d="M8 5v4M8 11v0" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Query Error</p>
                  <p className="text-sm text-red-600 font-mono mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {yourResult !== null && !error && (
              <ResultsPane
                yourResult={yourResult}
                expectedResult={lesson.expectedResult}
                match={match}
                isSandbox={isSandbox}
              />
            )}
          </div>
          <div className="hidden lg:block w-80 shrink-0 overflow-y-auto p-6 lg:border-l border-slate-200 bg-slate-50/50">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Collections</div>
            <SchemaViewer collections={lesson.collections} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                  Lesson {lesson.id} of {totalLessons}
                </span>
                {lesson.module && (
                  <span className="text-xs text-slate-400">{lesson.module}</span>
                )}
                {match === true && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium"
                    style={{ animation: 'pop-in 0.4s ease-out' }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 16 16">
                      <path d="M3 8l3 3 7-7" />
                    </svg>
                    Correct
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{lesson.title}</h2>
            </div>

            <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed">
              {lesson.explanation}
            </div>

            <button
              onClick={() => setShowMobileCollections(!showMobileCollections)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Collections
              <svg className={`w-3.5 h-3.5 transition-transform ${showMobileCollections ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {showMobileCollections && (
              <div className="lg:hidden border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <SchemaViewer collections={lesson.collections} />
              </div>
            )}

            <div className="bg-white border-l-4 border-[#47A248] rounded-r-lg shadow-sm px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 text-[#47A248]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Task</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">{lesson.task}</p>
            </div>

            {lesson.howItWorks && <HowItWorks>{lesson.howItWorks}</HowItWorks>}
            {lesson.realWorldUse && <RealWorldUse>{lesson.realWorldUse}</RealWorldUse>}
            {lesson.commonMistakes && <CommonMistakes>{lesson.commonMistakes}</CommonMistakes>}
            {lesson.syntaxBreakdown && <SyntaxBreakdown query={lesson.syntaxBreakdown.query} parts={lesson.syntaxBreakdown.parts} />}
            {lesson.dataFlow && <DataFlow stages={lesson.dataFlow} />}

            {hints && (
              <div>
                <button
                  onClick={() => {
                    setShowHint((s) => !s)
                    setHintIndex(0)
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <svg className={`w-3 h-3 transition-transform ${showHint ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                  {showHint ? 'Hide hints' : 'Need a hint?'}
                </button>
                {showHint && (
                  <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      {hintCount > 1 && (
                        <button
                          onClick={() => setHintIndex((i) => Math.max(0, i - 1))}
                          disabled={hintIndex === 0}
                          className="text-slate-400 hover:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                            <path d="M10 3L5 8l5 5" />
                          </svg>
                        </button>
                      )}
                      <div className="flex-1 text-sm text-blue-800 font-mono min-w-0">
                        {hints[hintIndex]}
                      </div>
                      {hintCount > 1 && (
                        <button
                          onClick={() => setHintIndex((i) => Math.min(hintCount - 1, i + 1))}
                          disabled={hintIndex === hintCount - 1}
                          className="text-slate-400 hover:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                            <path d="M6 3l5 5-5 5" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {hintCount > 1 && (
                      <div className="text-center mt-1.5">
                        <span className="text-xs text-blue-500">Hint {hintIndex + 1} of {hintCount}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <QueryEditor
              value={query}
              onChange={onQueryChange}
              onRun={onRun}
              onReset={onReset}
              isRunning={isRunning}
              modKey={modKey}
            />

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" />
                  <path d="M8 5v4M8 11v0" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Query Error</p>
                  <p className="text-sm text-red-600 font-mono mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {yourResult !== null && !error && (
              <ResultsPane
                yourResult={yourResult}
                expectedResult={lesson.expectedResult}
                match={match}
                isSandbox={isSandbox}
              />
            )}

            {match === true && allLessonsDone && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#47A248] rounded-xl p-6 text-center" style={{ animation: 'slide-up 0.4s ease-out' }}>
                <div className="w-14 h-14 bg-[#47A248] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 16 16">
                    <path d="M3 8l3 3 7-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">All Lessons Completed!</h3>
                <p className="text-sm text-slate-600 mb-4">You finished all {totalLessons} lessons in the MongoDB Easy tutorial.</p>
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#47A248]">{totalLessons}</div>
                    <div className="text-xs text-slate-500">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#47A248]">
                      {Object.values(lessonStates).reduce((sum, s) => sum + (s.attempts || 0), 0)}
                    </div>
                    <div className="text-xs text-slate-500">Total Attempts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#47A248]">{countCompleted}</div>
                    <div className="text-xs text-slate-500">Completed</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">You can replay any lesson from the sidebar to review.</p>
              </div>
            )}

            {match === true && !allLessonsDone && (
              <div className="bg-green-50 border border-green-200 rounded-lg" style={{ animation: 'slide-up 0.4s ease-out' }}>
                <div className="px-4 py-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                    <path d="M3 8l3 3 7-7" />
                  </svg>
                  <p className="text-sm font-medium text-green-800 flex-1">
                    Correct! Your query returned the expected results.
                  </p>
                </div>
                {isLastInModule && allModuleLessonsDone && (
                  <div className="px-4 pb-1">
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 rounded-md">
                      <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium text-emerald-800">
                        {getShortModuleName(moduleForLesson.name)} module complete!
                      </p>
                    </div>
                  </div>
                )}
                {lesson.id < totalLessons && (
                  <div className="px-4 pb-3">
                    <button
                      onClick={onNextLesson}
                      className="w-full px-4 py-2 rounded-md text-sm font-medium bg-[#47A248] text-white hover:bg-[#3a8a3e] active:bg-[#2d7231] transition-colors flex items-center justify-center gap-2"
                    >
                      Next Lesson
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                        <path d="M6 3l5 5-5 5" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {match === false && !error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" />
                  <path d="M8 5v4M8 11v0" />
                </svg>
                <p className="text-sm text-red-700">
                  Your result doesn't match the expected output. Check your query and try again.
                  {hints && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="ml-2 underline hover:text-red-900"
                    >
                      See hints
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="hidden lg:block w-80 shrink-0 overflow-y-auto p-6 lg:border-l border-slate-200 bg-slate-50/50">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Collections</div>
            <SchemaViewer collections={lesson.collections} />
          </div>
        </div>
      )}
    </div>
  )
}
