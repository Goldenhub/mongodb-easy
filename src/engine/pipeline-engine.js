import { evaluateQuery } from './operators.js'

export function executePipeline(ctx, pipeline) {
  if (!Array.isArray(pipeline)) {
    throw new Error('Aggregation pipeline must be an array')
  }

  let docs = ctx.collection.docs.map((d) => structuredClone(d))

  for (const stage of pipeline) {
    const stageName = Object.keys(stage)[0]
    const stageParams = stage[stageName]

    switch (stageName) {
      case '$match':
        docs = docs.filter((doc) => evaluateQuery(doc, stageParams))
        break
      case '$project':
        docs = docs.map((doc) => applyProjectStage(doc, stageParams))
        break
      case '$sort':
        docs = [...docs].sort((a, b) => {
          for (const [field, order] of Object.entries(stageParams)) {
            const aVal = resolveField(a, field)
            const bVal = resolveField(b, field)
            if (aVal < bVal) return -1 * order
            if (aVal > bVal) return 1 * order
          }
          return 0
        })
        break
      case '$limit':
        docs = docs.slice(0, stageParams)
        break
      case '$skip':
        docs = docs.slice(stageParams)
        break
      case '$count':
        docs = [{ [stageParams]: docs.length }]
        break
      case '$addFields':
        docs = docs.map((doc) => applyAddFields(doc, stageParams))
        break
      case '$unwind':
        docs = docs.flatMap((doc) => applyUnwind(doc, stageParams))
        break
      case '$group':
        docs = applyGroup(docs, stageParams)
        break
      case '$lookup':
        docs = applyLookup(docs, stageParams, ctx)
        break
      case '$bucket':
        docs = applyBucket(docs, stageParams)
        break
      case '$facet':
        docs = applyFacet(docs, stageParams, ctx)
        break
      default:
        throw new Error(`Unknown aggregation stage: ${stageName}`)
    }
  }

  return docs
}

function resolveField(doc, path) {
  if (typeof path === 'string' && path.startsWith('$')) {
    path = path.slice(1)
  }
  const parts = path.split('.')
  let val = doc
  for (const part of parts) {
    if (val == null || typeof val !== 'object') return undefined
    val = val[part]
  }
  return val
}

function applyProjectStage(doc, spec) {
  const includes = Object.values(spec).some((v) => v === 1)
  const result = {}

  if (includes) {
    for (const [key, val] of Object.entries(spec)) {
      if (val === 1) {
        result[key] = structuredClone(doc[key])
      } else if (typeof val === 'string' && val.startsWith('$')) {
        result[key] = resolveField(doc, val.slice(1))
      } else if (typeof val === 'object' && val !== null) {
        const computed = resolveExpression(doc, val)
        if (computed !== undefined) result[key] = computed
      }
    }
    if (!('_id' in spec)) {
      result._id = structuredClone(doc._id)
    }
  } else {
    for (const [key, val] of Object.entries(doc)) {
      if (!(key in spec) || spec[key] !== 0) {
        result[key] = structuredClone(val)
      }
    }
  }

  return result
}

function applyAddFields(doc, spec) {
  const result = structuredClone(doc)
  for (const [field, expr] of Object.entries(spec)) {
    result[field] = resolveExpression(doc, expr)
  }
  return result
}

function applyUnwind(doc, fieldPath) {
  const fieldName = typeof fieldPath === 'string' && fieldPath.startsWith('$')
    ? fieldPath.slice(1) : fieldPath.path ?? fieldPath
  const arr = resolveField(doc, fieldName)
  if (!Array.isArray(arr)) return [doc]
  if (arr.length === 0) return []
  return arr.map((item) => {
    const result = structuredClone(doc)
    result[fieldName] = item
    return result
  })
}

function applyGroup(docs, spec) {
  const idExpr = spec._id
  const groups = new Map()

  for (const doc of docs) {
    let groupKey
    if (idExpr === null) {
      groupKey = '__nogroup__'
    } else if (typeof idExpr === 'string' && idExpr.startsWith('$')) {
      groupKey = String(resolveField(doc, idExpr.slice(1)))
    } else if (typeof idExpr === 'object' && idExpr !== null) {
      groupKey = JSON.stringify(
        Object.fromEntries(
          Object.entries(idExpr).map(([k, v]) => [
            k,
            typeof v === 'string' && v.startsWith('$')
              ? resolveField(doc, v.slice(1))
              : v,
          ])
        )
      )
    } else {
      groupKey = '__nogroup__'
    }

    if (!groups.has(groupKey)) {
      let parsedId
      if (groupKey !== '__nogroup__') {
        try { parsedId = JSON.parse(groupKey) } catch { parsedId = groupKey }
      } else {
        parsedId = null
      }
      groups.set(groupKey, { _id: parsedId })
    }

    const group = groups.get(groupKey)
    for (const [key, val] of Object.entries(spec)) {
      if (key === '_id') continue
      if (typeof val === 'object' && val !== null) {
        const op = Object.keys(val)[0]
        const expr = val[op]
        accumulate(group, key, op, expr, doc)
      }
    }
  }

  return [...groups.values()].map(finalizeGroup)
}

function accumulate(group, field, op, expr, doc) {
  const val = typeof expr === 'string' && expr.startsWith('$')
    ? resolveField(doc, expr.slice(1)) : expr

  switch (op) {
    case '$sum': {
      group[field] = (group[field] ?? 0) + (typeof val === 'number' ? val : (val ? 1 : 0))
      break
    }
    case '$avg': {
      const count = group[`__avg_count_${field}`] ?? 0
      const sum = group[field] ?? 0
      group[field] = sum + (typeof val === 'number' ? val : 0)
      group[`__avg_count_${field}`] = count + 1
      break
    }
    case '$min': {
      if (group[field] === undefined || val < group[field]) group[field] = val
      break
    }
    case '$max': {
      if (group[field] === undefined || val > group[field]) group[field] = val
      break
    }
    case '$push': {
      if (!group[field]) group[field] = []
      group[field].push(val)
      break
    }
    case '$addToSet': {
      if (!group[field]) group[field] = []
      if (!group[field].some((item) => JSON.stringify(item) === JSON.stringify(val))) {
        group[field].push(val)
      }
      break
    }
    case '$first': {
      if (!(field in group)) group[field] = val
      break
    }
    case '$last': {
      group[field] = val
      break
    }
  }
}

function applyLookup(docs, spec, ctx) {
  const {
    from,
    localField,
    foreignField,
    as,
  } = spec

  const foreignCollection = ctx.collections[from]
  if (!foreignCollection) return docs

  return docs.map((doc) => {
    const localVal = resolveField(doc, localField)
    const matches = foreignCollection.docs.filter((foreignDoc) => {
      const foreignVal = resolveField(foreignDoc, foreignField)
      if (Array.isArray(localVal)) {
        return localVal.includes(foreignVal)
      }
      return localVal === foreignVal
    })
    return { ...doc, [as]: matches }
  })
}

function applyBucket(docs, spec) {
  const { groupBy, boundaries, default: defaultBucket, output } = spec
  const buckets = []

  for (let i = 0; i < boundaries.length - 1; i++) {
    const bucket = { _id: { min: boundaries[i], max: boundaries[i + 1] } }
    if (output) {
      for (const [outField, outExpr] of Object.entries(output)) {
        const op = Object.keys(outExpr)[0]
        initAccumulator(bucket, outField, op)
      }
    }
    buckets.push(bucket)
  }

  const defaultBucketObj = defaultBucket !== undefined
    ? { _id: defaultBucket }
    : null
  if (defaultBucketObj && output) {
    for (const [outField, outExpr] of Object.entries(output)) {
      const op = Object.keys(outExpr)[0]
      initAccumulator(defaultBucketObj, outField, op)
    }
  }

  for (const doc of docs) {
    const val = typeof groupBy === 'string' && groupBy.startsWith('$')
      ? resolveField(doc, groupBy.slice(1))
      : groupBy

    let placed = false
    for (let i = 0; i < boundaries.length - 1; i++) {
      if (val >= boundaries[i] && val < boundaries[i + 1]) {
        if (output) {
          for (const [outField, outExpr] of Object.entries(output)) {
            const op = Object.keys(outExpr)[0]
            const expr = outExpr[op]
            accumulate(buckets[i], outField, op, expr, doc)
          }
        }
        placed = true
        break
      }
    }

    if (!placed && defaultBucketObj && output) {
      for (const [outField, outExpr] of Object.entries(output)) {
        const op = Object.keys(outExpr)[0]
        const expr = outExpr[op]
        accumulate(defaultBucketObj, outField, op, expr, doc)
      }
    }
  }

  const result = buckets
  if (defaultBucketObj) {
    result.push(defaultBucketObj)
  }

  return result.map(finalizeGroup)
}

function initAccumulator(obj, field, op) {
  switch (op) {
    case '$sum': case '$avg':
      obj[field] = 0; break
    case '$push': case '$addToSet':
      obj[field] = []; break
    case '$min': case '$max': case '$first': case '$last':
      obj[field] = undefined; break
  }
}

function finalizeGroup(doc) {
  const result = {}
  for (const [key, val] of Object.entries(doc)) {
    if (key.startsWith('__avg_count_')) continue
    const countKey = `__avg_count_${key}`
    if (countKey in doc) {
      const count = doc[countKey]
      if (count > 0) {
        result[key] = roundNum(val / count)
        continue
      }
    }
    result[key] = val
  }
  return result
}

function resolveExpression(doc, expr) {
  if (typeof expr === 'string' && expr.startsWith('$')) {
    return resolveField(doc, expr.slice(1))
  }
  if (typeof expr === 'number' || typeof expr === 'boolean' || expr === null) return expr
  if (Array.isArray(expr)) {
    if (expr.length > 0 && typeof expr[0] === 'string' && expr[0].startsWith('$')) {
      const op = expr[0]
      const args = expr.slice(1).map((a) => resolveExpression(doc, a))
      return applyAggregationOperator(op, args)
    }
    return expr.map((e) => resolveExpression(doc, e))
  }
  if (typeof expr === 'object' && expr !== null) {
    if ('$cond' in expr) return applyCond(doc, expr.$cond)
    if ('$ifNull' in expr) return applyIfNull(doc, expr.$ifNull)
    if ('$subtract' in expr) return applyArithmetic(doc, expr.$subtract, (a, b) => a - b)
    if ('$add' in expr) return applyArithmetic(doc, expr.$add, (a, b) => a + b)
    if ('$multiply' in expr) return applyArithmetic(doc, expr.$multiply, (a, b) => a * b)
    if ('$divide' in expr) return applyArithmetic(doc, expr.$divide, (a, b) => a / b)
    if ('$toUpper' in expr) return String(resolveExpression(doc, expr.$toUpper)).toUpperCase()
    if ('$toLower' in expr) return String(resolveExpression(doc, expr.$toLower)).toLowerCase()
    if ('$substr' in expr) {
      const [str, start, length] = expr.$substr.map((e) => resolveExpression(doc, e))
      return String(str).substring(start, start + length)
    }

    const keys = Object.keys(expr)
    if (keys.length === 1 && keys[0].startsWith('$')) {
      const op = keys[0]
      const opArgs = Array.isArray(expr[op]) ? expr[op] : [expr[op]]
      const resolvedArgs = opArgs.map((a) => resolveExpression(doc, a))
      return applyAggregationOperator(op, resolvedArgs)
    }
    const result = {}
    for (const [key, val] of Object.entries(expr)) {
      result[key] = resolveExpression(doc, val)
    }
    return result
  }
  return expr
}

function applyAggregationOperator(op, args) {
  switch (op) {
    case '$sum': return args.reduce((a, b) => a + b, 0)
    case '$avg': return args.reduce((a, b) => a + b, 0) / args.length
    case '$min': return Math.min(...args)
    case '$max': return Math.max(...args)
    case '$lt': return args[0] < args[1]
    case '$gt': return args[0] > args[1]
    case '$lte': return args[0] <= args[1]
    case '$gte': return args[0] >= args[1]
    case '$eq': return args[0] === args[1]
    case '$ne': return args[0] !== args[1]
    default: return args[0]
  }
}

function applyCond(doc, cond) {
  const [ifExpr, thenExpr, elseExpr] = cond
  return resolveExpression(doc, ifExpr)
    ? resolveExpression(doc, thenExpr)
    : resolveExpression(doc, elseExpr)
}

function applyIfNull(doc, expr) {
  const [fieldExpr, defaultExpr] = expr
  const val = resolveExpression(doc, fieldExpr)
  return val ?? resolveExpression(doc, defaultExpr)
}

function roundNum(val) {
  if (typeof val === 'number' && !Number.isInteger(val)) {
    return Math.round(val * 1e10) / 1e10
  }
  return val
}

function applyArithmetic(doc, exprs, fn) {
  const vals = exprs.map((e) => resolveExpression(doc, e))
  return roundNum(vals.reduce(fn))
}

function applyFacet(docs, spec, ctx) {
  const result = {}
  for (const [outputField, pipeline] of Object.entries(spec)) {
    const subCtx = { collection: { docs: structuredClone(docs) }, collections: ctx.collections }
    result[outputField] = executePipeline(subCtx, pipeline)
  }
  return [result]
}
