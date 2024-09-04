import { RandomInviteCodeGenerator } from '@/infra/services/random-invite-code-generator'

describe('RandomInviteCodeGenerator', () => {
  let sut: RandomInviteCodeGenerator

  beforeEach(() => {
    sut = new RandomInviteCodeGenerator()
  })

  test('should generate a string of 8 characters', async () => {
    const code = await sut.generate()
    expect(code).toHaveLength(8)
  })

  test('should generate an alphanumeric string', async () => {
    const code = await sut.generate()
    const alphanumericRegex = /^[A-Za-z0-9]+$/
    expect(alphanumericRegex.test(code)).toBe(true)
  })

  test('should generate different codes on consecutive calls', async () => {
    const code1 = await sut.generate()
    const code2 = await sut.generate()
    expect(code1).not.toBe(code2)
  })
})
