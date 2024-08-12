import { Validation } from '@/presentation/protocols'

export class ValidationComposite implements Validation {
  constructor(private readonly _validations: Validation[]) {}

  validate(input: any): Error | null {
    for (const validation of this._validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}
