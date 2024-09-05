import { convertDatesToISOString } from '@/presentation/helpers/convert-date-to-string'

describe('convertDatesToISOString', () => {
  it('should return null if the input is null', () => {
    const result = convertDatesToISOString(null)
    expect(result).toBeNull()
  })

  it('should return undefined if the input is undefined', () => {
    const result = convertDatesToISOString(undefined)
    expect(result).toBeUndefined()
  })

  it('should return a date in ISO string format if the input is a Date instance', () => {
    const date = new Date('2024-09-03T21:01:54.637Z')
    const result = convertDatesToISOString(date)
    expect(result).toBe(date.toISOString())
  })

  it('should convert all Date instances in an array to ISO string format', () => {
    const date1 = new Date('2024-09-03T21:01:54.637Z')
    const date2 = new Date('2024-09-04T10:10:10.100Z')
    const result = convertDatesToISOString([date1, date2])
    expect(result).toEqual([date1.toISOString(), date2.toISOString()])
  })

  it('should convert all Date instances in an object to ISO string format', () => {
    const date = new Date('2024-09-03T21:01:54.637Z')
    const obj = { date, other: 'test' }
    const result = convertDatesToISOString(obj)
    expect(result).toEqual({ date: date.toISOString(), other: 'test' })
  })

  it('should handle nested objects and arrays containing Date instances', () => {
    const date1 = new Date('2024-09-03T21:01:54.637Z')
    const date2 = new Date('2024-09-04T10:10:10.100Z')
    const nested = { dates: [date1, { nestedDate: date2 }] }
    const result = convertDatesToISOString(nested)
    expect(result).toEqual({ dates: [date1.toISOString(), { nestedDate: date2.toISOString() }] })
  })

  it('should return the input unchanged if it is not a Date, object, or array', () => {
    const number = 42
    const string = 'hello'
    const boolean = true
    expect(convertDatesToISOString(number)).toBe(number)
    expect(convertDatesToISOString(string)).toBe(string)
    expect(convertDatesToISOString(boolean)).toBe(boolean)
  })
})
