import { CompareFieldsValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'

import { faker } from '@faker-js/faker'

const field = faker.lorem.word()
const fieldToCompare = faker.lorem.word()

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      [field]: 'any_field',
      [fieldToCompare]: 'other_field'
    })
    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  it('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const value = faker.lorem.word()
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(error).toBeFalsy()
  })
})
