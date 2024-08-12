import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly _fieldName: string,
    private readonly _fieldToCompareName: string
  ) {}

  validate(input: any): Error | null {
    if (input[this._fieldName] !== input[this._fieldToCompareName]) {
      return new InvalidParamError(this._fieldToCompareName)
    }
    return null
  }
}
