import lesson00 from './00-intro.jsx'
import lesson01 from './01-implicit-creation.jsx'
import lesson02 from './02-explicit-creation.jsx'
import lesson03 from './03-find-all.jsx'
import lesson04 from './04-projection.jsx'
import lesson05 from './05-where-equals.jsx'
import lesson06 from './06-comparisons.jsx'
import lesson07 from './07-logical.jsx'
import lesson08 from './08-in.jsx'
import lesson09 from './09-sort.jsx'
import lesson10 from './10-limit.jsx'
import lesson11 from './11-match.jsx'
import lesson12 from './12-project.jsx'
import lesson13 from './13-group-sum.jsx'
import lesson14 from './14-group-minmax.jsx'
import lesson15 from './15-sort-limit-agg.jsx'
import lesson16 from './16-unwind.jsx'
import lesson17 from './17-addFields.jsx'
import lesson18 from './18-count.jsx'
import lesson19 from './19-insert.jsx'
import lesson20 from './20-update.jsx'
import lesson21 from './21-set-unset-inc.jsx'
import lesson22 from './22-array-update.jsx'
import lesson23 from './23-delete.jsx'
import lesson24 from './24-regex.jsx'
import lesson25 from './25-exists-type.jsx'
import lesson26 from './26-expr.jsx'
import lesson27 from './27-elemMatch.jsx'
import lesson28 from './28-lookup.jsx'
import lesson29 from './29-cond-ifnull.jsx'
import lesson30 from './30-dates.jsx'
import lesson31 from './31-slice.jsx'
import lesson32 from './32-bucket.jsx'
import lesson33 from './33-facet.jsx'
import lesson34 from './34-embed-vs-reference.jsx'

const lessons = [
  lesson00,
  lesson01, lesson02, lesson03, lesson04, lesson05,
  lesson06, lesson07, lesson08, lesson09, lesson10,
  lesson11, lesson12, lesson13, lesson14, lesson15,
  lesson16, lesson17, lesson18, lesson19, lesson20,
  lesson21, lesson22, lesson23, lesson24, lesson25,
  lesson26, lesson27, lesson28, lesson29, lesson30,
  lesson31, lesson32, lesson33, lesson34,
]

export default lessons

export function getLesson(id) {
  return lessons.find((l) => l.id === id) ?? null
}
