import { DbLoadInviteByCode } from '@/application/usecases/invite'
import { DecrypterSpy } from '@/tests/application/mocks'

describe('DbLoadInviteByCode Usecases', () => {
  it('should call Decrypter with correct ciphertext', async () => {
    const decrypterSpy = new DecrypterSpy()
    const sut = new DbLoadInviteByCode(decrypterSpy)
    const encryptedCode = 'any_encrypted_code'
    await sut.load({ inviteCode: encryptedCode })
    expect(decrypterSpy.ciphertext).toBe(encryptedCode)
  })
})

