import { HttpResponse } from '@/presentation/protocols'

export interface Middleware<T = any> {
  handle: (_httpRequest: T) => Promise<HttpResponse>
}
