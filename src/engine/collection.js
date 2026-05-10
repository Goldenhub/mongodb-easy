import { evaluateQuery } from './operators.js'
import { executePipeline } from './pipeline-engine.js'

export class Collection {
  constructor(name, docs = []) {
    this.name = name
    this.docs = docs.map((d) => structuredClone(d))
  }

  find(query, projection) {
    const filter = query ?? {}
    let results = this.docs.filter((doc) => evaluateQuery(doc, filter))
    if (projection && Object.keys(projection).length > 0) {
      results = results.map((doc) => applyProjection(doc, projection))
    }
    return results
  }

  findOne(query, projection) {
    const results = this.find(query, projection)
    return results.length > 0 ? results[0] : null
  }

  insertOne(doc) {
    const newDoc = { _id: generateId(this.docs), ...structuredClone(doc) }
    this.docs.push(newDoc)
    return newDoc
  }

  insertMany(docs) {
    return docs.map((doc) => this.insertOne(doc))
  }

  updateOne(filter, update) {
    const idx = this.docs.findIndex((doc) => evaluateQuery(doc, filter))
    if (idx === -1) return { matchedCount: 0, modifiedCount: 0 }
    this.docs[idx] = applyUpdate(structuredClone(this.docs[idx]), update)
    return { matchedCount: 1, modifiedCount: 1 }
  }

  updateMany(filter, update) {
    let modifiedCount = 0
    for (let i = 0; i < this.docs.length; i++) {
      if (evaluateQuery(this.docs[i], filter)) {
        this.docs[i] = applyUpdate(structuredClone(this.docs[i]), update)
        modifiedCount++
      }
    }
    return { matchedCount: modifiedCount, modifiedCount }
  }

  deleteOne(filter) {
    const idx = this.docs.findIndex((doc) => evaluateQuery(doc, filter))
    if (idx === -1) return { deletedCount: 0 }
    this.docs.splice(idx, 1)
    return { deletedCount: 1 }
  }

  deleteMany(filter) {
    const before = this.docs.length
    this.docs = this.docs.filter((doc) => !evaluateQuery(doc, filter))
    return { deletedCount: before - this.docs.length }
  }

  countDocuments(query) {
    if (!query || Object.keys(query).length === 0) return this.docs.length
    return this.docs.filter((doc) => evaluateQuery(doc, query)).length
  }

  distinct(field, query) {
    const results = query ? this.find(query) : this.docs
    const values = new Set()
    for (const doc of results) {
      const val = getNestedValue(doc, field)
      if (val !== undefined) values.add(typeof val === 'object' ? JSON.stringify(val) : val)
    }
    return [...values].map((v) => {
      try { return JSON.parse(v) } catch { return v }
    })
  }

  aggregate(pipeline, collectionsMap = {}) {
    const ctx = { collection: this, collections: collectionsMap }
    return executePipeline(ctx, pipeline)
  }

  reset(docs) {
    this.docs = docs.map((d) => structuredClone(d))
  }
}

function getNestedValue(doc, path) {
  const parts = path.split('.')
  let val = doc
  for (const part of parts) {
    if (val == null || typeof val !== 'object') return undefined
    val = val[part]
  }
  return val
}

function setNestedValue(doc, path, value) {
  const parts = path.split('.')
  let current = doc
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) current[parts[i]] = {}
    current = current[parts[i]]
  }
  current[parts[parts.length - 1]] = value
  return doc
}

function unsetNestedValue(doc, path) {
  const parts = path.split('.')
  let current = doc
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) return doc
    current = current[parts[i]]
  }
  delete current[parts[parts.length - 1]]
  return doc
}

function applyProjection(doc, projection) {
  const includes = Object.values(projection).some((v) => v === 1)
  const result = {}

  if (includes) {
    for (const [key, val] of Object.entries(projection)) {
      if (val === 1) {
        result[key] = structuredClone(doc[key])
      }
    }
    if (!('_id' in projection)) {
      result._id = structuredClone(doc._id)
    }
  } else {
    for (const [key, val] of Object.entries(doc)) {
      if (!(key in projection) || projection[key] !== 0) {
        result[key] = structuredClone(val)
      }
    }
  }

  const sliceOps = Object.entries(projection).filter(
    ([, val]) => typeof val === 'object' && val !== null && '$slice' in val
  )
  for (const [key, val] of sliceOps) {
    result[key] = applySlice(doc[key], val.$slice)
  }

  return result
}

function applySlice(arr, n) {
  if (!Array.isArray(arr)) return arr
  if (n >= 0) return arr.slice(0, n)
  return arr.slice(n)
}

function applyUpdate(doc, update) {
  for (const [op, operand] of Object.entries(update)) {
    switch (op) {
      case '$set':
        for (const [key, val] of Object.entries(operand)) {
          setNestedValue(doc, key, structuredClone(val))
        }
        break
      case '$unset':
        for (const key of Object.keys(operand)) {
          unsetNestedValue(doc, key)
        }
        break
      case '$inc':
        for (const [key, val] of Object.entries(operand)) {
          const current = getNestedValue(doc, key) ?? 0
          setNestedValue(doc, key, current + val)
        }
        break
      case '$mul':
        for (const [key, val] of Object.entries(operand)) {
          const current = getNestedValue(doc, key) ?? 0
          setNestedValue(doc, key, current * val)
        }
        break
      case '$push':
        for (const [key, val] of Object.entries(operand)) {
          const current = getNestedValue(doc, key) ?? []
          if (!Array.isArray(current)) continue
          current.push(structuredClone(val))
          setNestedValue(doc, key, current)
        }
        break
      case '$pop':
        for (const [key, val] of Object.entries(operand)) {
          const current = getNestedValue(doc, key)
          if (!Array.isArray(current)) continue
          if (val === 1) current.pop()
          else if (val === -1) current.shift()
        }
        break
      case '$pull':
        for (const [key, val] of Object.entries(operand)) {
          const current = getNestedValue(doc, key)
          if (!Array.isArray(current)) continue
          doc[key] = current.filter((item) => !evaluateQuery(item, val))
        }
        break
      case '$addToSet':
        for (const [key, val] of Object.entries(operand)) {
          const current = getNestedValue(doc, key) ?? []
          if (!Array.isArray(current)) continue
          const exists = current.some((item) => JSON.stringify(item) === JSON.stringify(val))
          if (!exists) current.push(structuredClone(val))
          setNestedValue(doc, key, current)
        }
        break
      case '$rename':
        for (const [oldName, newName] of Object.entries(operand)) {
          const val = getNestedValue(doc, oldName)
          if (val !== undefined) {
            unsetNestedValue(doc, oldName)
            setNestedValue(doc, newName, val)
          }
        }
        break
    }
  }
  return doc
}

function generateId(existingDocs) {
  const maxId = existingDocs.reduce((max, d) => Math.max(max, d._id ?? 0), 0)
  return maxId + 1
}
