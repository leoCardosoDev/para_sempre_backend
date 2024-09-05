export const convertDatesToISOString = (value: any): any => {
  if (value === null || value === undefined) return value
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) {
    return value.map(convertDatesToISOString)
  }
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, convertDatesToISOString(val)]))
  }
  return value
}
