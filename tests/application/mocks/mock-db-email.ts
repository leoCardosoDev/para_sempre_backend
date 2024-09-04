import { CheckEmailRepository } from '@/domain/email'

export class CheckEmailRepositorySpy implements CheckEmailRepository {
  result = false
  async checkByEmail(_email: string): Promise<boolean> {
    return new Promise(resolve => resolve(this.result))
  }
}
