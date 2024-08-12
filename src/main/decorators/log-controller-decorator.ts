import { Controller, HttpResponse } from '@/presentation/protocols'
import { LogErrorRepository } from '@/application/protocols/db'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly _controller: Controller,
    private readonly _logErrorRepository: LogErrorRepository
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    const httpResponse = await this._controller.handle(request)
    if (httpResponse.statusCode === 500) {
      await this._logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
