import { DbCreateAccountWithInvite } from '@/application/usecases'
import { mockAccountWithInviteParams } from '@/tests/domain/mocks'
import { LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'

type SutTypes = {
  sut: DbCreateAccountWithInvite
  loadInviteByCodeRepository: LoadInviteByCodeRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadInviteByCodeRepository = new LoadInviteByCodeRepositorySpy()
  const sut = new DbCreateAccountWithInvite(loadInviteByCodeRepository)
  return { sut, loadInviteByCodeRepository }
}

describe('DbCreateAccountWithInvite Usecases', () => {
  it('should call LoadInviteByCodeRepository with correct values', async () => {
    const { sut, loadInviteByCodeRepository } = makeSut()
    const addParams = mockAccountWithInviteParams()
    await sut.create(addParams)
    expect(loadInviteByCodeRepository.inviteCode).toEqual(addParams.inviteCode)
  })
})
