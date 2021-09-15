import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { AcessToken } from '@/domain/models'
import { RequiredStringValidator } from '@/application/validation/'

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock
  let sut: FacebookLoginController
  let token: string

  beforeAll(() => {
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue(new AcessToken('any_value'))
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

    expect(facebookAuth).toHaveBeenCalledWith({ token })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if Authentication fails', async () => {
    facebookAuth.mockResolvedValueOnce(new UnauthorizedError())
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
        accessToken: 'any_value'
      }
    })
  })
})
