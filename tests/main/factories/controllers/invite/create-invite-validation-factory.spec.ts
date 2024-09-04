import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators'
import { makeCreateInviteValidation } from '@/main/factories/controllers/invite'

jest.mock('@/validation/validators/validation-composite')

describe('CreateInviteValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeCreateInviteValidation()
    const validations: Validation[] = []
    for (const field of ['emailUser', 'phoneUser', 'status', 'inviteType', 'createdAt', 'expiration', 'maxUses']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('emailUser', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
