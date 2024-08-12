import { HttpResponse } from '@/presentation/protocols'

export interface Controller<T = any> {
  handle: (_request: T) => Promise<HttpResponse>
}
