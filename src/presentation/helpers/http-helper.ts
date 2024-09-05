import { HttpResponse } from '@/presentation/protocols'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { convertDatesToISOString } from './convert-date-to-string'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack || 'No stack trace available')
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: convertDatesToISOString(data)
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})
