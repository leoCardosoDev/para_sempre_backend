import { InviteCodeGenerator } from '@/application/protocols'

export class RandomInviteCodeGenerator implements InviteCodeGenerator {
  async generate(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    return result
  }
}
