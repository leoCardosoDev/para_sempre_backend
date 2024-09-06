export class CustomError extends Error {
  constructor(public readonly message: string) {
    super(message)
    this.name = 'CustomError'
  }
}
