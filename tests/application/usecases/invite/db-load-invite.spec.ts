import { DbLoadInvite } from '@/application/usecases/invite'
import { LoadInviteParams } from '@/domain/usecases'
import { LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadInvite
  loadInviteByCodeRepositorySpy: LoadInviteByCodeRepositorySpy
}

const mockInviteCode = (): LoadInviteParams => ({
  inviteCode: faker.lorem.word()
})

const makeSut = (): SutTypes => {
  const loadInviteByCodeRepositorySpy = new LoadInviteByCodeRepositorySpy()
  const sut = new DbLoadInvite(loadInviteByCodeRepositorySpy)
  return { sut, loadInviteByCodeRepositorySpy }
}

describe('DbLoadInvite Usecases', () => {
  it('should calls LoadInviteByCode with correct values', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    const code = mockInviteCode()
    const loadByCodeSpy = jest.spyOn(loadInviteByCodeRepositorySpy, 'loadByCode')
    await sut.load(code)
    expect(loadByCodeSpy).toHaveBeenCalledWith(code.inviteCode)
    expect(loadByCodeSpy).toHaveBeenCalledTimes(1)
  })
})
