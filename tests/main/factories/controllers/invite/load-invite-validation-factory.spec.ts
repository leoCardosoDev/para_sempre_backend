import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { makeLoadInviteValidation } from '@/main/factories/controllers/invite'

jest.mock('@/validation/validators/validation-composite')

describe('LoadInviteValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoadInviteValidation()
    const validations: Validation[] = []
    for (const field of ['inviteCode']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
