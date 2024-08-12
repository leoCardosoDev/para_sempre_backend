export interface Hasher {
  hash: (_plaintext: string) => Promise<string>
}
