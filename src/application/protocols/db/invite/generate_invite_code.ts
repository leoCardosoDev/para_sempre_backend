export interface InviteCodeGenerator {
  generate: () => Promise<string>
}
