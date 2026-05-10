function normalize(doc) {
  const entries = Object.entries(doc)
    .filter(([key]) => key !== '_id' || doc._id !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}

function deepEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false
  if (typeof a === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      return a.every((item, i) => deepEqual(item, b[i]))
    }
    const keysA = Object.keys(a).filter((k) => a[k] !== undefined)
    const keysB = Object.keys(b).filter((k) => b[k] !== undefined)
    if (keysA.length !== keysB.length) return false
    return keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]))
  }
  return a === b
}

export function compareResults(userDocs, expectedDocs) {
  if (!Array.isArray(userDocs) || !Array.isArray(expectedDocs)) {
    return userDocs === expectedDocs
  }
  if (userDocs.length !== expectedDocs.length) return false
  if (userDocs.length === 0 && expectedDocs.length === 0) return true

  const normalizedUser = userDocs.map(normalize).sort()
  const normalizedExpected = expectedDocs.map(normalize).sort()

  return normalizedUser.every((u, i) => u === normalizedExpected[i])
}

export function deepEqualResults(actual, expected) {
  return deepEqual(actual, expected)
}
