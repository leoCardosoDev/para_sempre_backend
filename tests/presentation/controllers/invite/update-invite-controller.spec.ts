import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { LoadInviteSpy, throwError, UpdateInviteSpy } from '@/tests/domain/mocks'
import { UpdateInviteController, UpdateInviteControllerParams } from '@/presentation/controllers'
import { MissingParamError, NotFoundError } from '@/presentation/errors'
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers'

const mockRequest = (): UpdateInviteControllerParams => ({
  inviteCode: faker.string.uuid(),
  status: 'used',
  createdAt: faker.date.past().toISOString(),
  expiration: faker.date.future().toISOString(),
  usedAt: faker.date.recent().toISOString()
})

const mockInviteResult = (): any => ({
  inviteId: 'any_invite_id',
  accountId: 'any_account_id',
  inviteCode: 'any_invite_code',
  emailUser: 'any_email@user.com',
  phoneUser: '1234567890',
  status: 'active',
  expiration: new Date('2025-01-29T01:29:12.841Z'),
  usedAt: null
})

type SutTypes = {
  sut: UpdateInviteController
  validationSpy: ValidationSpy
  loadInviteSpy: LoadInviteSpy
  updateInviteSpy: UpdateInviteSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadInviteSpy = new LoadInviteSpy()
  const updateInviteSpy = new UpdateInviteSpy()
  const sut = new UpdateInviteController(validationSpy, loadInviteSpy, updateInviteSpy)
  return { sut, validationSpy, loadInviteSpy, updateInviteSpy }
}

describe('UpdateInvite Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.lorem.word())
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should call LoadInvite with correct params', async () => {
    const { sut, loadInviteSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadInviteSpy.callsCount).toBe(1)
    expect(loadInviteSpy.params).toEqual({ inviteCode: request.inviteCode })
  })

  it('should return 404 if LoadInvite returns null', async () => {
    const { sut, loadInviteSpy } = makeSut()
    jest.spyOn(loadInviteSpy, 'load').mockResolvedValueOnce(null)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(notFound(new NotFoundError()))
  })

  it('should call UpdateInvite with correct values', async () => {
    const { sut, loadInviteSpy, updateInviteSpy } = makeSut()
    const inviteData = mockInviteResult()
    jest.spyOn(loadInviteSpy, 'load').mockResolvedValueOnce(inviteData)
    const request = mockRequest()
    await sut.handle(request)
    const expectedUpdateData = {
      inviteCode: request.inviteCode,
      status: request.status,
      createdAt: new Date(request.createdAt),
      expiration: new Date(request.expiration),
      usedAt: new Date()
    }
    expect(updateInviteSpy.updateParams).toEqual(expectedUpdateData)
  })

  it('should returns 500 if LoadInvite throws', async () => {
    const { sut, loadInviteSpy } = makeSut()
    jest.spyOn(loadInviteSpy, 'load').mockImplementationOnce(throwError)
    const request = mockRequest()
    const promise = await sut.handle(request)
    expect(promise).toEqual(serverError(new Error()))
  })

  it('should returns 500 if UpdateInvite throws', async () => {
    const { sut, updateInviteSpy } = makeSut()
    jest.spyOn(updateInviteSpy, 'update').mockImplementationOnce(throwError)
    const request = mockRequest()
    const promise = await sut.handle(request)
    expect(promise).toEqual(serverError(new Error()))
  })

  it('should returns false if update fail', async () => {
    const { sut, updateInviteSpy } = makeSut()
    const request = mockRequest()
    jest.spyOn(updateInviteSpy, 'update').mockResolvedValueOnce(false)
    const result = await sut.handle(request)
    expect(result).toEqual(notFound(new NotFoundError()))
  })

  it('should return 200 on success', async () => {
    const { sut, loadInviteSpy } = makeSut()
    jest.spyOn(loadInviteSpy, 'load').mockResolvedValueOnce(mockInviteResult())
    const request = mockRequest()
    const result = await sut.handle(request)
    expect(result).toEqual(ok(true))
  })
})
