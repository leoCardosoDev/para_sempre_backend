import { SignUpController, SignUpControllerRequest } from '@/presentation/controllers'
import { faker } from '@faker-js/faker'
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import { CreateAccountWithInviteSpy, throwError } from '@/tests/domain/mocks'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { CustomError } from '@/presentation/errors/custom-error'

const mockRequest = (): SignUpControllerRequest => {
  const password = faker.internet.password()
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
    inviteCode: faker.string.uuid()
  }
}

type SutTypes = {
  sut: SignUpController
  createAccountWithInviteSpy: CreateAccountWithInviteSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const createAccountWithInviteSpy = new CreateAccountWithInviteSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(createAccountWithInviteSpy, validationSpy, authenticationSpy)
  return {
    sut,
    createAccountWithInviteSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  it('Should return 500 if CreateAccount throws', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    jest.spyOn(createAccountWithInviteSpy, 'create').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('No stack trace available')))
  })

  it('Should call CreateAccount with correct values', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(createAccountWithInviteSpy.params).toEqual({
      name: request.name,
      email: request.email,
      password: request.password,
      inviteCode: request.inviteCode
    })
  })

  it('Should return 403 if invalid code is provided', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    createAccountWithInviteSpy.result = { success: false, error: ['Invalid invite code'] }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new CustomError('Invalid invite code')))
  })

  it('Should return 403 if invalid code is used', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    createAccountWithInviteSpy.result = { success: false, error: ['Used invite code'] }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new CustomError('Used invite code')))
  })

  it('Should return 403 if email does match', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    createAccountWithInviteSpy.result = { success: false, error: ['Email does not match the invite'] }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new CustomError('Email does not match the invite')))
  })

  it('Should return 403 if email is already registered', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    createAccountWithInviteSpy.result = { success: false, error: ['Email already registered'] }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new CustomError('Email already registered')))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })

  it('should return "Unknown error" if errorMessages is undefined or empty', async () => {
    const { sut, createAccountWithInviteSpy } = makeSut()
    createAccountWithInviteSpy.result = { success: false, error: undefined }
    let httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new CustomError('Unknown error')))
    createAccountWithInviteSpy.result = { success: false, error: [] }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new CustomError('Unknown error')))
  })

  it('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.lorem.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      password: request.password
    })
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
