import { DbLoadInviteByCode } from '@/application/usecases/invite'
import { DecrypterSpy, LoadInviteByCodeRepositorySpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadInviteByCode
  decrypterSpy: DecrypterSpy
  loadInviteByCodeSpy: LoadInviteByCodeRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadInviteByCodeSpy = new LoadInviteByCodeRepositorySpy
  const sut = new DbLoadInviteByCode(decrypterSpy, loadInviteByCodeSpy)
  return {
    sut,
    decrypterSpy,
    loadInviteByCodeSpy
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
    const { sut, loadInviteByCodeSpy } = makeSut()
    await sut.load({ inviteCode: encryptedCode })
    expect(loadInviteByCodeSpy.inviteCode).toBe(encryptedCode)
  })
})

