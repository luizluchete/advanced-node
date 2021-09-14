import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation/'
import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/composite')

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

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({ token })

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator('any_token', 'token')
    ])

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
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

  it('Should return 500 if Authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.execute.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
