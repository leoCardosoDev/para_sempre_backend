import { badRequest, forbidden, unauthorized, serverError, ok, noContent, notFound } from '@/presentation/helpers/http-helper'
import { ServerError, UnauthorizedError } from '@/presentation/errors'

describe('HttpHelper', () => {
  it('badRequest should return 400 and the provided error', () => {
    const error = new Error('any_error')
    const httpResponse = badRequest(error)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
  })

  it('unauthorized should return 401 and an UnauthorizedError', () => {
    const httpResponse = unauthorized()
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: new UnauthorizedError()
    })
  })

  it('forbidden should return 403 and the provided error', () => {
    const error = new Error('any_error')
    const httpResponse = forbidden(error)
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: error
    })
  })

  it('notFound should return 404 and the provided error', () => {
    const error = new Error('any_error')
    const httpResponse = notFound(error)
    expect(httpResponse).toEqual({
      statusCode: 404,
      body: error
    })
  })

  it('serverError should return 500 and a ServerError with provided stack trace', () => {
    const stack = 'any_stack_trace'
    const error = new Error('any_error')
    error.stack = stack
    const httpResponse = serverError(error)
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(stack)
    })
  })

  it('serverError should return 500 and a ServerError with "No stack trace available" if stack is missing', () => {
    const error = new Error('any_error')
    error.stack = undefined
    const httpResponse = serverError(error)
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError('No stack trace available')
    })
  })

  it('ok should return 200 and the provided data', () => {
    const data = { any: 'data' }
    const httpResponse = ok(data)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: data
    })
  })

  it('ok should return 200 and convert dates to ISO string format', () => {
    const date = new Date()
    const data = { date }
    const httpResponse = ok(data)
    expect(httpResponse.body.date).toBe(date.toISOString())
  })

  it('noContent should return 204 and null as body', () => {
    const httpResponse = noContent()
    expect(httpResponse).toEqual({
      statusCode: 204,
      body: null
    })
  })

  it('badRequest should handle null or undefined error gracefully', () => {
    const httpResponse = badRequest(null as any)
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: null
    })
  })
})
