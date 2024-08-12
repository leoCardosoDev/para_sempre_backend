import { Encrypter, Decrypter } from '@/application/protocols'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly _secret: string) {}

  async encrypt(plaintext: string): Promise<string> {
    return jwt.sign({ id: plaintext }, this._secret)
  }

  async decrypt(ciphertext: string): Promise<string> {
    return jwt.verify(ciphertext, this._secret) as any
  }
}
