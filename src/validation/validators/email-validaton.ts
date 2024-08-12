import { EmailValidator } from '@/validation/protocols'
import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

export class EmailValidation implements Validation {
  constructor(
    private readonly _fieldName: string,
    private readonly _emailValidator: EmailValidator
  ) {}

  validate(input: any): Error | null {
    const isValid = this._emailValidator.isValid(input[this._fieldName])
    if (!isValid) {
      return new InvalidParamError(this._fieldName)
    }
    return null
  }
}
