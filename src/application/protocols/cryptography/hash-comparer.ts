export interface HashComparer {
  compare: (_plaitext: string, _digest: string) => Promise<boolean>
}
