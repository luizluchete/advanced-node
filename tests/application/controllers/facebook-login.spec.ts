import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredStringValidator } from '@/application/validation/'

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.execute.mockResolvedValue(new AcessToken('any_value'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('Should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('Should call FacebooAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.execute).toHaveBeenCalledWith({ token })
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if Authentication fails', async () => {
    facebookAuth.execute.mockResolvedValueOnce(new UnauthorizedError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('Should return 200 if Authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        acessToken: 'any_value'
      }
    })
  })
})
