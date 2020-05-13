function iconBinding(value) {
  if (!value) return
  if (value instanceof Array || typeof value === 'string') return { icon: value }
  return value
}

function isPromise(val) {
  return typeof val === 'function' && 'then' in val && 'catch' in val
}

export { iconBinding, isPromise }
