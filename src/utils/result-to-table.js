export function docsToArray(docs) {
  if (!Array.isArray(docs)) return []
  return docs.map((doc) => {
    const row = {}
    for (const [key, val] of Object.entries(doc)) {
      if (val !== undefined) {
        row[key] = typeof val === 'object' && val !== null && !Array.isArray(val)
          ? JSON.stringify(val)
          : val
      }
    }
    return row
  })
}
