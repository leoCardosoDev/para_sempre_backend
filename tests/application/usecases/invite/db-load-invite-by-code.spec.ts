import { DbLoadInviteByCode } from '@/application/usecases/invite'
import { DecrypterSpy, LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadInviteByCode
  decrypterSpy: DecrypterSpy
  loadInviteByCodeRepositorySpy: LoadInviteByCodeRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadInviteByCodeRepositorySpy = new LoadInviteByCodeRepositorySpy
  const sut = new DbLoadInviteByCode(decrypterSpy, loadInviteByCodeRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadInviteByCodeRepositorySpy
  }
}

let encryptedCode: string

describe('DbLoadInviteByCode Usecases', () => {

  beforeAll(() => {
    encryptedCode = faker.string.uuid()
  })

  it('should call Decrypter with correct ciphertext', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load({ inviteCode: encryptedCode })
    expect(decrypterSpy.ciphertext).toBe(encryptedCode)
  })

  it('should returns null if Decrypter null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.decrypt = jest.fn().mockResolvedValueOnce(null)
    const invite = await sut.load({ inviteCode: encryptedCode })
    expect(invite).toBeNull()
  })

  it('should call LoadInviteByCodeRepository with correct values with correct ciphertext', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    await sut.load({ inviteCode: encryptedCode })
    expect(loadInviteByCodeRepositorySpy.inviteCode).toBe(encryptedCode)
  })

  test('Should return null if LoadInviteByCodeRepository returns null', async () => {
    const { sut, loadInviteByCodeRepositorySpy } = makeSut()
    loadInviteByCodeRepositorySpy.loadByCode = jest.fn().mockResolvedValueOnce(null)
    const invite = await sut.load({ inviteCode: encryptedCode })
    expect(invite).toBeNull()
  })
})

