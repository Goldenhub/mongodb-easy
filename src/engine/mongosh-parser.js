export class ParseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParseError'
  }
}

export function parseQuery(queryString) {
  const trimmed = queryString.trim()
  if (!trimmed) {
    throw new ParseError('Query is empty')
  }

  let dbCallMatch = trimmed.match(/^db\.(\w+)\.(\w+)\s*\(/)
  let isDbMethod = false
  if (!dbCallMatch) {
    dbCallMatch = trimmed.match(/^db\.(\w+)\s*\(/)
    if (!dbCallMatch) {
      throw new ParseError('Expected format: db.collection.method(args)')
    }
    isDbMethod = true
  }

  const collection = isDbMethod ? null : dbCallMatch[1]
  const method = isDbMethod ? dbCallMatch[1] : dbCallMatch[2]

  const rest = trimmed.slice(dbCallMatch[0].length - 1)
  const argsStr = extractParenthesizedBlock(rest, 0)
  if (argsStr === null) {
    throw new ParseError('Unmatched parentheses in function call')
  }

  let args = []
  if (argsStr.trim()) {
    args = splitArgs(argsStr.trim())
  }

  let remaining = rest.slice(argsStr.length + 2)
  const chains = parseChainedMethods(remaining)

  return { collection, method, argsRaw: args, chains }
}

function parseChainedMethods(str) {
  const chains = []
  let remaining = str.trim()

  while (remaining) {
    if (!remaining.startsWith('.')) break

    const methodMatch = remaining.match(/^\.(\w+)\s*\(/)
    if (!methodMatch) break

    const methodName = methodMatch[1]
    const afterMethod = remaining.slice(methodMatch[0].length - 1)
    const argsStr = extractParenthesizedBlock(afterMethod, 0)
    if (argsStr === null) break

    let args = []
    if (argsStr.trim()) {
      args = splitArgs(argsStr.trim()).map((a) => evaluateArg(a))
    }

    chains.push({ method: methodName, args })

    remaining = afterMethod.slice(argsStr.length + 2).trim()
  }

  return chains
}

function extractParenthesizedBlock(str, startIdx) {
  let depth = 0
  let started = false
  let result = ''

  for (let i = startIdx; i < str.length; i++) {
    const ch = str[i]
    if (!started) {
      if (ch === '(') {
        started = true
        depth = 1
      }
      continue
    }

    if (ch === '(') depth++
    else if (ch === ')') {
      depth--
      if (depth === 0) return result
    }

    if (ch === '/' && depth <= 1) {
      const regexResult = tryParseRegex(str, i)
      if (regexResult) {
        result += regexResult.match
        i = regexResult.endIndex - 1
        continue
      }
    }

    result += ch
  }

  return null
}

function tryParseRegex(str, startIdx) {
  if (str[startIdx] !== '/') return null

  let escaped = false
  for (let i = startIdx + 1; i < str.length; i++) {
    if (escaped) { escaped = false; continue }
    if (str[i] === '\\') { escaped = true; continue }
    if (str[i] === '/') {
      let end = i + 1
      while (end < str.length && /[gimsuy]/.test(str[end])) end++
      return { match: str.slice(startIdx, end), endIndex: end }
    }
  }
  return null
}

function splitArgs(argsStr) {
  const args = []
  let depth = 0
  let current = ''
  let inString = false
  let stringChar = null

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i]

    if (inString) {
      current += ch
      if (ch === '\\') {
        i++
        if (i < argsStr.length) current += argsStr[i]
      } else if (ch === stringChar) {
        inString = false
      }
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true
      stringChar = ch
      current += ch
      continue
    }

    if (ch === '(' || ch === '[' || ch === '{') {
      depth++
      current += ch
      continue
    }

    if (ch === ')' || ch === ']' || ch === '}') {
      depth--
      current += ch
      continue
    }

    if (ch === ',' && depth === 0) {
      const trimmed = current.trim()
      if (trimmed) args.push(trimmed)
      current = ''
      continue
    }

    current += ch
  }

  const trimmed = current.trim()
  if (trimmed) args.push(trimmed)

  return args
}

export function evaluateArg(argStr) {
  try {
    return new Function(`return (${argStr})`)()
  } catch {
    throw new ParseError(`Could not parse argument: ${argStr}`)
  }
}
