import { DbLoadInviteByCode } from '@/application/usecases/invite'
import { LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'

import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadInviteByCode
  loadInviteByCodeRepositorySpy: LoadInviteByCodeRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadInviteByCodeRepositorySpy = new LoadInviteByCodeRepositorySpy
  const sut = new DbLoadInviteByCode(loadInviteByCodeRepositorySpy)
  return {
    sut,
    loadInviteByCodeRepositorySpy
  }
}

let encryptedCode: string

describe('DbLoadInviteByCode Usecases', () => {

  beforeAll(() => {
    encryptedCode = faker.string.uuid()
  })

  it('should call LoadInviteByCodeRepository with correct values with correct ciphertext', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    await sut.load({ inviteCode: encryptedCode })
    expect(loadInviteByCodeRepositorySpy.inviteCode).toBe(encryptedCode)
  })

  it('Should return null if LoadInviteByCodeRepository returns null', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    loadInviteByCodeRepositorySpy.loadByCode = jest.fn().mockResolvedValueOnce(null)
    const invite = await sut.load({ inviteCode: encryptedCode })
    expect(invite).toBeNull()
  })

  it('Should return an invite on success', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    const invite = await sut.load({ inviteCode: encryptedCode })
    expect(invite).toEqual(loadInviteByCodeRepositorySpy.result)
  })
})

