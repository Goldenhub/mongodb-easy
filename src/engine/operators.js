export function evaluateQuery(doc, query) {
  if (!query || Object.keys(query).length === 0) return true

  for (const [key, condition] of Object.entries(query)) {
    if (key === '$and') {
      if (!condition.every((sub) => evaluateQuery(doc, sub))) return false
      continue
    }
    if (key === '$or') {
      if (!condition.some((sub) => evaluateQuery(doc, sub))) return false
      continue
    }
    if (key === '$not') {
      if (evaluateQuery(doc, condition)) return false
      continue
    }
    if (key === '$nor') {
      if (condition.some((sub) => evaluateQuery(doc, sub))) return false
      continue
    }
    if (key === '$where') {
      if (typeof condition === 'string') {
        try { return new Function('doc', `return ${condition}`)(doc) } catch { return false }
      }
      if (typeof condition === 'function') return condition(doc)
      return false
    }
    if (key === '$expr') {
      return evaluateExpression(doc, condition)
    }

    const docVal = getNestedValue(doc, key)
    if (!matchCondition(docVal, condition)) return false
  }
  return true
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

function matchCondition(docVal, condition) {
  if (condition === null) return docVal === null
  if (typeof condition !== 'object' || condition instanceof RegExp) {
    return docVal === condition
  }

  if (Array.isArray(condition)) {
    return condition.some((item) => matchCondition(docVal, item))
  }

  for (const [op, operand] of Object.entries(condition)) {
    switch (op) {
      case '$eq': if (!(docVal === operand)) return false; break
      case '$ne': if (!(docVal !== operand)) return false; break
      case '$gt': if (!(docVal > operand)) return false; break
      case '$gte': if (!(docVal >= operand)) return false; break
      case '$lt': if (!(docVal < operand)) return false; break
      case '$lte': if (!(docVal <= operand)) return false; break
      case '$in': if (!(Array.isArray(operand) && operand.some((v) => v === docVal))) return false; break
      case '$nin': if (!(Array.isArray(operand) && operand.every((v) => v !== docVal))) return false; break
      case '$exists': if (operand ? docVal === undefined : docVal !== undefined) return false; break
      case '$type': {
        const bsonType = typeof docVal === 'number' ? 'number'
          : typeof docVal === 'string' ? 'string'
          : typeof docVal === 'boolean' ? 'bool'
          : Array.isArray(docVal) ? 'array'
          : docVal === null ? 'null'
          : docVal instanceof Date ? 'date'
          : typeof docVal === 'object' ? 'object' : typeof docVal
        if (bsonType !== operand) return false
        break
      }
      case '$regex': {
        const regex = operand instanceof RegExp ? operand : new RegExp(operand)
        if (!regex.test(String(docVal))) return false
        break
      }
      case '$options': break
      case '$elemMatch': {
        if (!Array.isArray(docVal)) return false
        if (!docVal.some((item) => evaluateQuery(item, operand))) return false
        break
      }
      default: return false
    }
  }
  return true
}

function evaluateExpression(doc, expr) {
  if (!expr || typeof expr !== 'object') return !!expr

  if (expr.$eq) return resolveExpr(doc, expr.$eq[0]) === resolveExpr(doc, expr.$eq[1])
  if (expr.$ne) return resolveExpr(doc, expr.$ne[0]) !== resolveExpr(doc, expr.$ne[1])
  if (expr.$gt) return resolveExpr(doc, expr.$gt[0]) > resolveExpr(doc, expr.$gt[1])
  if (expr.$gte) return resolveExpr(doc, expr.$gte[0]) >= resolveExpr(doc, expr.$gte[1])
  if (expr.$lt) return resolveExpr(doc, expr.$lt[0]) < resolveExpr(doc, expr.$lt[1])
  if (expr.$lte) return resolveExpr(doc, expr.$lte[0]) <= resolveExpr(doc, expr.$lte[1])
  if (expr.$and) return expr.$and.every((e) => evaluateExpression(doc, e))
  if (expr.$or) return expr.$or.some((e) => evaluateExpression(doc, e))
  if (expr.$not) return !evaluateExpression(doc, expr.$not)
  return true
}

function resolveExpr(doc, expr) {
  if (typeof expr === 'string' && expr.startsWith('$')) {
    return getNestedValue(doc, expr.slice(1))
  }
  if (typeof expr === 'number' || typeof expr === 'boolean' || expr === null) return expr
  if (Array.isArray(expr)) return expr.map((e) => resolveExpr(doc, e))
  if (typeof expr === 'object') {
    const result = {}
    for (const [k, v] of Object.entries(expr)) result[k] = resolveExpr(doc, v)
    return result
  }
  return expr
}
