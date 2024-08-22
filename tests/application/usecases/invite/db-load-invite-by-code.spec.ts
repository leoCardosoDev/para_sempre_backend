import { DbLoadInviteByCode } from '@/application/usecases/invite'
import { DecrypterSpy } from '@/tests/application/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadInviteByCode
  decrypterSpy: DecrypterSpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const sut = new DbLoadInviteByCode(decrypterSpy)
  return {
    sut,
    decrypterSpy
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
})

