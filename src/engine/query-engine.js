import { Collection } from './collection.js'
import { parseQuery, evaluateArg, ParseError } from './mongosh-parser.js'

export class Database {
  constructor(seedData = {}) {
    this.collections = {}
    this.seedData = seedData
    for (const [name, docs] of Object.entries(seedData)) {
      this.collections[name] = new Collection(name, docs)
    }
  }

  reset() {
    for (const [name, docs] of Object.entries(this.seedData)) {
      if (this.collections[name]) {
        this.collections[name].reset(docs)
      } else {
        this.collections[name] = new Collection(name, docs)
      }
    }
  }

  execute(queryString) {
    const parsed = parseQuery(queryString)
    const coll = this.collections[parsed.collection]
    if (!coll) {
      const available = Object.keys(this.collections).join(', ')
      throw new ParseError(`Collection '${parsed.collection}' not found. Available: ${available}`)
    }

    const args = parsed.argsRaw.map((a) => evaluateArg(a))
    const method = parsed.method

    let result
    switch (method) {
      case 'find': {
        result = coll.find(args[0], args[1])
        result = applyChains(result, parsed.chains)
        break
      }
      case 'findOne': {
        result = coll.findOne(args[0], args[1])
        break
      }
      case 'insertOne': {
        result = coll.insertOne(args[0])
        break
      }
      case 'insertMany': {
        result = coll.insertMany(args[0])
        break
      }
      case 'updateOne': {
        result = coll.updateOne(args[0], args[1])
        break
      }
      case 'updateMany': {
        result = coll.updateMany(args[0], args[1])
        break
      }
      case 'deleteOne': {
        result = coll.deleteOne(args[0])
        break
      }
      case 'deleteMany': {
        result = coll.deleteMany(args[0])
        break
      }
      case 'countDocuments': {
        result = coll.countDocuments(args[0])
        break
      }
      case 'distinct': {
        result = coll.distinct(args[0], args[1])
        break
      }
      case 'aggregate': {
        result = coll.aggregate(args[0], this.collections)
        break
      }
      default: {
        throw new ParseError(`Unknown method: db.${parsed.collection}.${method}()`)
      }
    }

    return { result, collection: parsed.collection, method }
  }
}

function applyChains(results, chains) {
  let docs = Array.isArray(results) ? [...results] : results

  for (const chain of chains) {
    switch (chain.method) {
      case 'sort': {
        const sortSpec = chain.args[0]
        if (!sortSpec) break
        docs = [...docs].sort((a, b) => {
          for (const [field, order] of Object.entries(sortSpec)) {
            const aVal = resolveField(a, field)
            const bVal = resolveField(b, field)
            if (aVal < bVal) return -1 * order
            if (aVal > bVal) return 1 * order
          }
          return 0
        })
        break
      }
      case 'limit': {
        const n = chain.args[0]
        docs = docs.slice(0, n)
        break
      }
      case 'skip': {
        const n = chain.args[0]
        docs = docs.slice(n)
        break
      }
      case 'count': {
        docs = docs.length
        break
      }
      case 'pretty': {
        break
      }
    }
  }

  return docs
}

function resolveField(doc, field) {
  const parts = field.split('.')
  let val = doc
  for (const part of parts) {
    if (val == null) return undefined
    val = val[part]
  }
  return val
}
