import lesson01 from './01-find-all.jsx'
import lesson02 from './02-projection.jsx'
import lesson03 from './03-where-equals.jsx'
import lesson04 from './04-comparisons.jsx'
import lesson05 from './05-logical.jsx'
import lesson06 from './06-in.jsx'
import lesson07 from './07-sort.jsx'
import lesson08 from './08-limit.jsx'
import lesson09 from './09-match.jsx'
import lesson10 from './10-project.jsx'
import lesson11 from './11-group-sum.jsx'
import lesson12 from './12-group-minmax.jsx'
import lesson13 from './13-sort-limit-agg.jsx'
import lesson14 from './14-unwind.jsx'
import lesson15 from './15-addFields.jsx'
import lesson16 from './16-count.jsx'
import lesson17 from './17-insert.jsx'
import lesson18 from './18-update.jsx'
import lesson19 from './19-set-unset-inc.jsx'
import lesson20 from './20-array-update.jsx'
import lesson21 from './21-delete.jsx'
import lesson22 from './22-regex.jsx'
import lesson23 from './23-exists-type.jsx'
import lesson24 from './24-expr.jsx'
import lesson25 from './25-elemMatch.jsx'
import lesson26 from './26-lookup.jsx'
import lesson27 from './27-cond-ifnull.jsx'
import lesson28 from './28-dates.jsx'
import lesson29 from './29-slice.jsx'
import lesson30 from './30-bucket.jsx'
import lesson31 from './31-facet.jsx'

const lessons = [
  lesson01, lesson02, lesson03, lesson04, lesson05,
  lesson06, lesson07, lesson08, lesson09, lesson10,
  lesson11, lesson12, lesson13, lesson14, lesson15,
  lesson16, lesson17, lesson18, lesson19, lesson20,
  lesson21, lesson22, lesson23, lesson24, lesson25,
  lesson26, lesson27, lesson28, lesson29, lesson30,
  lesson31,
]

export default lessons

export function getLesson(id) {
  return lessons.find((l) => l.id === id) ?? null
}
