import { CheckEmailRepository, CheckEmailRepositoryResult } from '@/application/protocols/db/email'

export class CheckEmailRepositorySpy implements CheckEmailRepository {
  email: string
  result = false
  async checkByEmail(_email: string): Promise<CheckEmailRepositoryResult> {
    this.email = _email
    return new Promise(resolve => resolve(this.result))
  }
}
