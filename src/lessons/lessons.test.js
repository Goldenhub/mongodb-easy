import { describe, it, expect } from 'vitest'
import { Database } from '../engine/query-engine.js'
import { compareResults } from '../utils/compare-results.js'
import lessons from './index.js'

describe('all lessons', () => {
  lessons.forEach((lesson) => {
    it(`lesson ${lesson.id}: ${lesson.title}`, () => {
      const db = new Database(lesson.collections)
      const { result } = db.execute(lesson.defaultQuery)
      const resultArray = Array.isArray(result) ? result : [result]
      const match = compareResults(resultArray, lesson.expectedResult)
      if (!match) {
        expect(resultArray).toEqual(lesson.expectedResult)
      }
    })
  })
})
