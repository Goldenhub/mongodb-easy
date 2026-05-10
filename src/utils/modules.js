export const MODULE_NAMES = {
  1: 'Module 1: Reading Data',
  9: 'Module 2: Aggregation',
  17: 'Module 3: Modifying Data',
  22: 'Module 4: Advanced Queries',
  28: 'Module 5: Power User',
}

export function getModuleBoundaries(lessonCount) {
  const keys = Object.keys(MODULE_NAMES).map(Number).sort((a, b) => a - b)
  return keys.map((start, i) => ({
    start,
    end: i + 1 < keys.length ? keys[i + 1] - 1 : lessonCount,
    name: MODULE_NAMES[start],
  }))
}

export function getModuleForLesson(lessonId, lessonCount) {
  return getModuleBoundaries(lessonCount).find(
    (m) => lessonId >= m.start && lessonId <= m.end
  ) || null
}

export function getShortModuleName(name) {
  return name.replace(/^Module \d+: /, '')
}
