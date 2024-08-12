export interface Decrypter {
  decrypt: (_ciphertext: string) => Promise<string>
}
