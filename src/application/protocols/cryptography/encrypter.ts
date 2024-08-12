export interface Encrypter {
  encrypt: (_plaintext: string) => Promise<string>
}
