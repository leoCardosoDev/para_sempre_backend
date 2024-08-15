import { ServerError } from '@/presentation/errors'

describe('ServerError', () => {
  test('Should have a default stack trace as empty string if no stack is provided', () => {
    const error = new ServerError()
    expect(error.stack).toBe('')
  })

  test('Should store the stack trace if provided', () => {
    const stack = 'any_stack_trace'
    const error = new ServerError(stack)
    expect(error.stack).toBe(stack)
  })
})
