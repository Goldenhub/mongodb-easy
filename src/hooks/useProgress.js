import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mongeesy-progress'
const OLD_STORAGE_KEY = 'mongodb-easy-progress'
const APP_VERSION = '1.0.0'

function loadData() {
  try {
    const oldStored = localStorage.getItem(OLD_STORAGE_KEY)
    const newStored = localStorage.getItem(STORAGE_KEY)

    let stored
    if (oldStored) {
      stored = oldStored
      localStorage.setItem(STORAGE_KEY, stored)
      localStorage.removeItem(OLD_STORAGE_KEY)
    } else {
      stored = newStored
    }

    if (!stored) return defaultData()

    const parsed = JSON.parse(stored)

    if (Array.isArray(parsed)) {
      return migrateFromLegacy(parsed)
    }

    if (parsed && typeof parsed === 'object' && parsed.lessons) {
      return parsed
    }

    return defaultData()
  } catch {
    return defaultData()
  }
}

function defaultData() {
  return {
    version: APP_VERSION,
    updatedAt: new Date().toISOString(),
    lessons: {},
  }
}

function migrateFromLegacy(legacyArray) {
  const lessons = {}
  for (const id of legacyArray) {
    lessons[String(id)] = {
      completed: true,
      completedAt: null,
      lastCode: '',
      attempts: 0,
    }
  }
  const data = {
    version: APP_VERSION,
    updatedAt: new Date().toISOString(),
    lessons,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

function saveData(data) {
  data.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useProgress() {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const lessonStates = data.lessons

  const countCompleted = Object.values(lessonStates).filter((s) => s.completed).length

  const isCompleted = useCallback(
    (lessonId) => lessonStates[String(lessonId)]?.completed === true,
    [lessonStates]
  )

  const updateLessonState = useCallback((lessonId, state) => {
    const key = String(lessonId)
    setData((prev) => {
      const prevLesson = prev.lessons[key]
      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [key]: {
            ...prevLesson,
            ...state,
          },
        },
      }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setData(defaultData())
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { lessonStates, countCompleted, isCompleted, updateLessonState, resetProgress, appVersion: APP_VERSION }
}
