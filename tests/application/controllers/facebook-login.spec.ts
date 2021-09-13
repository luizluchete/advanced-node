import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.execute.mockResolvedValue(new AcessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('Should return 400 if token is undefied', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required')
    })
  })

  it('Should call FacebooAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.execute).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if Authentication fails', async () => {
    facebookAuth.execute.mockResolvedValueOnce(new UnauthorizedError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('Should return 200 if Authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        acessToken: 'any_value'
      }
    })
  })

  it('Should return 500 if Authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.execute.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
