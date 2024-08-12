export interface Validation {
  validate: (_input: any) => Error | null
}
